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

    //check if its longer than 0 trimmed of whitespace and if its not null
    if(clientid !== null && clientid.trim(' ').length > 0){

        if(getepoch() - access_expires > 0){
            axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/refreshtoken', {
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
        //var lcl =  window.localStorage.getItem('spotify_username')
        if( lcl === null || lcl.split(' ').length < 1){
            var tempuser = 'user'+Math.floor(Math.random() * 10000);
        }
        else{
            var tempuser = lcl;
        }

        return (
            <div className="toplevel">
                <Header/>
                <div className="center">
                    <h2 className="Label">Username:</h2>
                    <input type="text" maxLength={10} id="userinput" className="codeinput shadow" defaultValue={tempuser}></input>
                </div>
                <div className="center">
                    <Button name="Join Lobby" click={()=>{
                    window.localStorage.setItem('spotify_username',document.getElementById('userinput').value)
                    //window.localStorage.setItem('spotify_username',document.getElementById('userinput').value)
                    window.location.replace('lobby/join');
                }}/>
                </div>
                <div className="center">
                    <Button name="Create Lobby" click={()=>{
                    window.localStorage.setItem('spotify_username',document.getElementById('userinput').value)
                    //window.localStorage.setItem('spotify_username',document.getElementById('userinput').value)
                    window.location.replace('create');
                }}/>
                </div>
                <div className="center">
                    <SpotifyLinker/>
                </div>
                <p className="center version_num top">build 052922</p>
                <p className="center version_num">Ryan Zmuda - 2022</p>
                <p className="center bugreport" onClick={()=>{
                    window.open('https://github.com/Yoyolick/spotiguess/issues', '_blank').focus();
                }}>click to report a bug</p>
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
                <p className="center version_num top">build 052922</p>
                <p className="center version_num">Ryan Zmuda - 2022</p>
                <p className="center bugreport" onClick={()=>{
                    window.open('https://github.com/Yoyolick/spotiguess/issues', '_blank').focus();
                }}>click to report a bug</p>
            </div>
            
        )
    }
}