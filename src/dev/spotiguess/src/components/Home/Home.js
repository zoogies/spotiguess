import Button from "../Button/Button";
import Header from "../Header/Header";
import SpotifyLinker from "../SpotifyLinker/SpotifyLinker";
import "./Home.css";
import getepoch from "../../Resources/utcepoch";
import axios from "axios";
import "../CreateLobby/CreateLobby.css";

export default function Home(){
    //grab our cached id from local storage
    var clientid = window.localStorage.getItem('spotify_access_token');
    var access_expires = window.localStorage.getItem('spotify_token_expires');
    if(getepoch() - access_expires > 0){
        axios.post('http://'+process.env.REACT_APP_SERVER_ADDRESS + '/refreshtoken', {
        refresh_token: window.localStorage.getItem('spotify_refresh_token')
        })
        .then(function (response) {
            var newtoken = JSON.parse(JSON.parse(response.data))
            window.localStorage.setItem('spotify_access_token',(newtoken['access_token']));
            window.localStorage.setItem('spotify_token_expires',newtoken['expires_in'] + getepoch());
        })
        .catch(function (error) {
        console.error(error);
        });
    }
    var lcl =  window.localStorage.getItem('spotify_username')
    //DEBUG TODO
    //var lcl =  window.sessionStorage.getItem('spotify_username')
    if( lcl === null || lcl.split(' ').length < 1){
        var tempuser = 'user'+Math.floor(Math.random() * 10000);
    }
    else{
        var tempuser = lcl;
    }
    //check if its longer than 0 trimmed of whitespace and if its not null
    if(clientid !== null && clientid.trim(' ').length > 0){
        return (
            <div className="toplevel">
                <Header/>
                <div className="center">
                    <h2 className="Label">Username:</h2>
                    <input type="text" maxLength={10} id="userinput" className="codeinput shadow" defaultValue={tempuser}></input>
                </div>
                <div className="center" onClick={()=>{
                    window.localStorage.setItem('spotify_username',document.getElementById('userinput').value)
                    //window.sessionStorage.setItem('spotify_username',document.getElementById('userinput').value)
                    window.location.replace('lobby/join');
                }}>
                    <Button name="Join Lobby"/>
                </div>
                <div className="center" onClick={()=>{
                    window.localStorage.setItem('spotify_username',document.getElementById('userinput').value)
                    //window.sessionStorage.setItem('spotify_username',document.getElementById('userinput').value)
                    window.location.replace('create');
                }}>
                    <Button name="Create Lobby"/>
                </div>
                <div className="center">
                    <SpotifyLinker/>
                </div>
            </div>
        )
    }
    else{
        return(
            <div className="toplevel">
                <Header/>
                 <div className="toplevel">
                    <SpotifyLinker/>
                </div>
            </div>
            
        )
    }
}