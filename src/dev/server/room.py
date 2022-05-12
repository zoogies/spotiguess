from asyncore import read
from email import header
from operator import truediv
from unicodedata import name
from wsgiref import headers
import requests
from requests.structures import CaseInsensitiveDict
import random
import time

class room:
    def __init__(self,id,questions,timespan):
        self.id = id # tracks lobby id # (join code)
        self.players = {} # list of player dicts storing data
        self.private = {} # list of private player data like tokens
        self.questionamount = questions # int num of questions
        self.timespan = timespan # str timespan for spotify api calls
        self.questions = [] #actual questions for the lobby
        self.contenttype = 'song' #lobby shit
        self.gamestate = 'lobby'
        self.usedsongs = [] # list that tracks used song urls
        self.votes = [] # array of tokens of those who have voted
        self.scoreboard = {} #IM GETTING LAZY BUT ITS OK BECAUSE THIS IS JUST A PROTO AND NEED TO FINISH SOON
        self.givenboard = 0
        self.correctvotes = []
        self.lastinteraction = int(time.time()) #tracks last epoch of a direct player interaction (for despawning the lobby) TODO NEEDS IMPLEMENTED
    
    # returns the game state
    def getgamestate(self):
        return self.gamestate

    # returns player data and state from lobby
    def getplayers(self):
        reactsucks = []
        for player in self.players:
            reactsucks.append({player:self.players[player]})
        return reactsucks

    # FLOW:
    # check for matching tokens
    # - if yes:
    #   - check if name is the same
    #     - if yes:
    #       - dont change anything reconnect user
    #     - if no:
    #       - ignore new name and reconnect user
    # - if no:
    #   - add player to lobby
    def addplayer(self,name,token):
        self.lastinteraction = int(time.time())

        if(name in self.players): # if the players name is in the lobby
            if(self.private[name]['token'] == token): #if this player already exists(likely reconnecting)
                #print(self.players)
                return True #all gucci
            else:
                return False #not allowed
        else:
            #TODO ADD CHECK FOR DUPLICATE TOKEN WITH DIFFERENT NAME, LEAVING ON NOW FOR DEBUG PURPOSES
            for name in self.players:
                if self.private[name][token] == token:
                    return False
            # TODO UNCOMMENT THIS FOR PLAYTEST

            self.players[name] = {'state':'unready'}
            self.private[name] = {'token':token}
            #print(self.players)
            return True
    
    # lets players leave the game and checks if lobby is empty after the operation so the main thread can pop it off the stack
    def removeplayer(self,name,token):
        self.lastinteraction = int(time.time())

        self.players.pop(name) # remove player from players
        self.private.pop(name) # remove players private data
        if(len(self.players) == 0 and len(self.private) == 0):
            return False
        else:
            return True
    
    # allows players to ready up
    def readyplayer(self,name,token):
        self.lastinteraction = int(time.time())

        self.players[name]['state'] = 'ready'
        #print(name,self.players[name]['state'])
        return self.trytostart()

    # called after player ready event, checks if there are 4 or more players and if they are all ready then generates all questions
    def trytostart(self):
        self.lastinteraction = int(time.time())

        ready = True

        if(len(self.players.keys()) < 4):
            ready = False

        for p in self.players:
            if(self.players[p]['state'] != 'ready'):
                ready = False
                #print(p,'not ready')
        if ready:
            self.gamestate = 'ingame'
            # TODO ACTUALLY FOR PICKING QUESTIONS AND AVOIDING REPEATS THE QUESTION SHOULD PICK THE PERSON AND THEN GO IN DESCENDING ORDER OF THEIR POPULAR SO ITS REAL AND
            if(self.contenttype == 'song'):
                #loop picking each person in order
                for i in range(int(self.questionamount)):
                    # generating the correct amount of questions...
                    # start by iterating over the amount of questions we need to make
                    # pick a random person from our player list, get their token and get a top song from the spotify api
                    person = list(self.private)[random.randint(0,len(self.private) -1)]

                    self.questions.append({
                        "song":{},
                        "answers":{
                            person:"correct"
                            # this is where other incorrect people will be generated
                        }
                    })

                    #WARNING TODO UNTESTED METHOD FOR POPULATING INCORRECT GUESSES
                    while(len(self.questions[i]['answers']) < 4):
                        wrongperson = list(self.private)[random.randint(0,len(self.private) -1)]
                        if wrongperson in self.questions[i]['answers']:
                            pass
                        else:
                            self.questions[i]['answers'][wrongperson] = "incorrect"
                    
                # loop generating questions
                for i in range(len(self.questions)):
                    url = 'https://api.spotify.com/v1/me/top/tracks?time_range='+(self.timespan).replace(" ","_")+'&limit=20&offset=0'

                    headers = CaseInsensitiveDict()
                    headers["Authorization"] = ("Bearer " + self.private.get(person)['token'])

                    #####

                    # THIS IS A CRAZY SCUFFY PART OF THE METHOD THAT ENSURES THE REQUEST WENT THROUGH (COULD RESULT IN INFINITE LOOP BE CAREFUL)

                    resp = requests.get(url, headers=headers)

                    while(resp.status_code != 200):
                        #print('entered catch loop')
                        resp = requests.get(url, headers=headers)

                    resp = resp.json()

                    #####

                    #print('prewhile',self.questions[i]['song'])
                    while(self.questions[i]['song']=={}):
                        songurl = resp['items'][random.randint(0,len(resp['items'])-1)]['external_urls']['spotify']
                        if songurl in self.usedsongs:
                            pass
                        else:
                            self.questions[i]['song']= "https://open.spotify.com/embed/"+songurl[25:]
                            self.usedsongs.append("https://open.spotify.com/embed/"+songurl[25:])
                            #print('set list',i,'to',songurl)
                    

                    #self.questions[i]['song'] = {}
                
                ready = self.questions

                return ready # EVENTUALLY THIS RETURN WILL BE CHECKED AS EITHER FALSE OR THE GAME DATA
            else:
                return False
    
    # returns true if everyone has voted, else returns an int of votes
    def vote(self,name,qnum,answer):

        if name not in self.scoreboard:
            self.scoreboard[name] = 0

        if(self.questions[qnum -1]['answers'][answer] == 'correct'):
            self.scoreboard[name] += 1

        if(name not in self.votes):
            self.votes.append(name)
            if(len(self.votes) == len(self.players)):
                self.votes = []
                self.correctvotes = []
                return True
            else:
                return str(len(self.votes)) + "/" + str(len(self.players))
        else:
            return str(len(self.votes)) + "/" + str(len(self.players))
    
    def getleaderboard(self):
        #f(self.gamestate != 'leaderboard'):
        #    self.gamestate = 'leaderboard'
        self.givenboard +=1
        return self.scoreboard #TODO 

    def checkdespawn(self):
        if(self.givenboard >= len(self.players)): #if we have given the final leaderboard to every player
            return True
        if(int(time.time()) - self.lastinteraction > 599): #if its been approx 10 minutes since a lobby interaction was recorded
            return True

        return False #if both conditions fail we should not despawn lobby