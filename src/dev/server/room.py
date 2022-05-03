class room:
    def __init__(self,id,questions,timespan):
        self.id = id
        self.players = {}
        self.private = {}
        self.questions = questions
        self.timespan = timespan

    def changeplayers(self,operation,id,name):
        if(operation == 'join'):
            players[id] = name
        if(operation == 'leave'):
            players[id].pop()
    
    def getdata(self):
        return "id: "+str(self.id) + " players: "+str(self.players)+" questions: "+self.questions+" timespan: "+self.timespan
    
    def getplayers(self):
        reactsucks = []
        for player in self.players:
            #print(self.players)
            #print(player)
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
        if(name in self.players): # if the players name is in the lobby
            if(self.private[name]['token'] == token): #if this player already exists(likely reconnecting)
                return True #all gucci
            else:
                return False #not allowed
        else:
            #TODO ADD CHECK FOR DUPLICATE TOKEN WITH DIFFERENT NAME, LEAVING ON NOW FOR DEBUG PURPOSES
            self.players[name] = {'state':'unready'}
            self.private[name] = {'token':token}
            return True