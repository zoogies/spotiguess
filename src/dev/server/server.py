from cgitb import reset
from crypt import methods
from distutils.log import debug
import os
from sched import scheduler
from flask import Flask, render_template, request, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from apscheduler.schedulers.background import BackgroundScheduler
import json
from flask_cors import CORS
import random
from flask import request
from room import room
import atexit
import spotify_auth

spotifydata = json.load(open('spotifydata.json'))

#variables for spotify
authendpoint = spotifydata['authEndpoint']
redirecturi = spotifydata['redirectUri']
clientid = spotifydata['clientId']
clientsecret =spotifydata['clientSecret']


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*")

stack = {}

###############

#CHECK STACK FOR DEAD/BUGGED LOBBIES
def lobbypurge():
    for lobby in list(stack):
        if stack[lobby].checkdespawn():
            stack.pop(lobby)

scheduler = BackgroundScheduler()
scheduler.add_job(func=lobbypurge, trigger="interval", seconds=600) #check for dead lobbies every 10 minutes
scheduler.start()
atexit.register(lambda: scheduler.shutdown())

###############

@app.route('/createlobby', methods = ['POST'])
def createlobby():
    lobbynum = random.randint(10000,99999)
    stack[lobbynum] = room(lobbynum,request.json['questions'],request.json['timespan'])
    return json.dumps(lobbynum)

@app.route('/checklobbyexists',methods=['POST'])
def checklobbyexists():
    if(int(request.json['lobbyid']) not in stack):
        return json.dumps(False)
    else:
        return json.dumps(True)

@app.route('/gentoken',methods=['POST'])
def gentoken():
    return json.dumps(spotify_auth.getToken(request.json['code'],clientid,clientsecret,redirecturi))

@app.route('/refreshtoken',methods=['POST'])
def refreshtoken():
    return json.dumps(spotify_auth.refreshAuth(request.json['refresh_token'],clientid,clientsecret))


@socketio.event
def connect():
    emit('serverconnect', {'status':'good','data': 'connected'})
    #emit('newplayer', {'status':'good','data': stack[90820].getplayers()})

@socketio.on('client_disconnecting')
def disconnect_details(data):
    #print(data)
    pass # DOES NOT WORK

@socketio.event
def lobbyupdate(message):
    try:
        if(message['action'] == 'join'): #if player trying to join
            if(stack[int(message['lobbyid'])].addplayer(message['name'],message['token'])):
                join_room(message['lobbyid'])
                emit('lobbyupdate',{'status':'good','data': stack[int(message['lobbyid'])].getplayers()}, to=message['lobbyid'])
            else:
                emit('lobbyupdate', {'status':'bad','data': 'You are already in this lobby with a different name.'})
        elif(message['action'] == 'leave'):
            stack[int(message['lobbyid'])].removeplayer(message['name'],message['token'])
            roomop = leave_room(message['lobbyid'])
            if(roomop == False):
                stack.pop(int(message['lobbyid']))
            else:
                #print('hitting up my clients')
                emit('lobbyupdate',{'status':'good','data': stack[int(message['lobbyid'])].getplayers()}, to=message['lobbyid'])
        elif(message['action'] == 'ready'):
            stack[int(message['lobbyid'])].readyplayer(message['name'],message['token'])
            emit('lobbyupdate',{'status':'good','data': stack[int(message['lobbyid'])].getplayers()}, to=message['lobbyid'])
            result = stack[int(message['lobbyid'])].trytostart()
            if(result != False and result != None):
                emit('entergame',{'status':'good','data': result}, to=message['lobbyid'])

        elif(message['action'] == 'vote'):
            votes = stack[int(message['lobbyid'])].vote(message['name'],message['question'],message['answer']) #either true of the number of votes
            if(votes == True): #True if that was the last vote, should emit to show the answers then clients will move on
                pass
            else: #TODO CHECK HERE TO END THE GAME AFTER LAST QUESTION OR HANDLE THAT CLIENT SIDE
                emit('gameupdate',{'status':'good','data': votes}, to=message['lobbyid'])
                #emit() #SEND JUST BACK TO THAT ONE CLIENT IF THEY ARE RIGHT SO THEY CAN CACHE IT
        elif(message['action'] == 'getleaderboard'):
            leaderboard = stack[int(message['lobbyid'])].getleaderboard()
            if(stack[int(message['lobbyid'])].checkdespawn()):
                stack.pop(int(message['lobbyid'])) #thank god for automatic memory management
            emit('leaderboardresponse',{'status':'good','data': leaderboard})
    except:
        pass

address = "127.0.0.1"
#address = "192.168.50.214"

if __name__ == '__main__':
    socketio.run(app,use_reloader=True,debug=True,host=address,port=5050)

# IDEAS
# could add question time amount and additional game parameters