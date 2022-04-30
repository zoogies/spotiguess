class room:
    def __init__(self,id,questions,timespan):
        self.id = id
        self.players = {}
        self.questions = questions
        self.timespan = timespan

    def changeplayers(self,operation,id,name):
        if(operation == 'join'):
            players[id] = name
        if(operation == 'leave'):
            players[id].pop()
    
    def getdata(self):
        return "id: "+str(self.id) + " players: "+str(self.players)+" questions: "+self.questions+" timespan: "+self.timespan