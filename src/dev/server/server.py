from distutils.log import debug
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import json
from flask_cors import CORS
import random
from flask import request
from room import room

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

@socketio.event
def my_event(message):
    emit('my response', {'data': 'got it!'})

if __name__ == '__main__':
    socketio.run(app,use_reloader=True,debug=True)