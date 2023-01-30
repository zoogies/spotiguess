import os
from flask import Flask, render_template, request, send_from_directory
from flask_cors import CORS
from flask import request
import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='/home/pi/spotiguess/src/dev/spotiguess/build')
CORS(app)

# SPOTIGUESS.ZOOGIES.LIVE

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(use_reloader=True,debug=True,host="192.168.50.214",port=5000)