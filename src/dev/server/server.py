from crypt import methods
from distutils.log import debug
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room, send
import json
from flask_cors import CORS
import random
from flask import request
from room import room
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

@app.route('/')
def index():
    return "lol"

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

@socketio.event
def lobbyupdate(message):
    if(message['action'] == 'join'):
        try:
            if(stack[int(message['lobbyid'])].addplayer(message['name'],message['token'])):
                join_room(message['lobbyid'])
                emit('lobbyupdate',{'status':'good','data': stack[int(message['lobbyid'])].getplayers()}, to=message['lobbyid'])
            else:
                emit('lobbyupdate', {'status':'bad','data': 'This name is already in this lobby.'})
        except Exception as e:
            print(e)
            emit('lobbyupdate',{'status':'bad','data': 'This lobby has ended.'})
    elif(message['action'] == 'leave'):
        stack[int(message['lobbyid'])].removeplayer(message['name'],message['token'])
        roomop = leave_room(message['lobbyid'])
        if(roomop == False):
            stack.pop(int(message['lobbyid']))
        else:
            print('hitting up my clients')
            emit('lobbyupdate',{'status':'good','data': stack[int(message['lobbyid'])].getplayers()}, to=message['lobbyid'])

if __name__ == '__main__':
    socketio.run(app,use_reloader=True,debug=True)