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
            print(self.players)
            print(player)
            reactsucks.append({player:self.players[player]})
        return reactsucks

    def addplayer(self,name,token):
        if(name in self.players):
            return False
        else:
            self.players[name] = {'state':'unready'}
            self.private[name] = {'token':token}
            return True