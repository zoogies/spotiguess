import base64, json, requests

SPOTIFY_URL_AUTH = 'https://accounts.spotify.com/authorize/?'
SPOTIFY_URL_TOKEN = 'https://accounts.spotify.com/api/token/'
RESPONSE_TYPE = 'code'   
HEADER = 'application/x-www-form-urlencoded'
    
def getToken(code, client_id, client_secret, redirect_uri):
    body = {
        "grant_type": 'authorization_code',
        "code" : code,
        "redirect_uri": redirect_uri,
        "client_id": client_id,
        "client_secret": client_secret
    }
        
     
    auth_str = bytes('{}:{}'.format(client_id, client_secret), 'utf-8')
    encoded = base64.b64encode(auth_str).decode('utf-8')
    headers = {"Content-Type" : HEADER, "Authorization" : "Basic {}".format(encoded)} 

    post = requests.post(SPOTIFY_URL_TOKEN, params=body, headers=headers)
    return ((post.text))
    
def handleToken(response):
    auth_head = {"Authorization": "Bearer {}".format(response["access_token"])}
    return [response["access_token"], auth_head, response["scope"], response["expires_in"]]

def refreshAuth(refresh_token,client_id,client_secret):
    body = {
        "grant_type" : "refresh_token",
        "refresh_token" : refresh_token
    }
    auth_str = bytes('{}:{}'.format(client_id, client_secret), 'utf-8')
    encoded = base64.b64encode(auth_str).decode('utf-8')
    headers = {"Content-Type" : HEADER, "Authorization" : "Basic {}".format(encoded)} 
    post_refresh = requests.post(SPOTIFY_URL_TOKEN, data=body, headers=headers)
    p_back = json.dumps(post_refresh.text)
    return (p_back)