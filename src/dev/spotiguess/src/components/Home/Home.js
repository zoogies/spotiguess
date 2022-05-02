import Button from "../Button/Button";
import Header from "../Header/Header";
import SpotifyLinker from "../SpotifyLinker/SpotifyLinker";
import "./Home.css";
import getepoch from "../../Resources/utcepoch";
import axios from "axios";

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
        console.log(error);
        });
    }
    //check if its longer than 0 trimmed of whitespace and if its not null
    if(clientid !== null && clientid.trim(' ').length > 0){
        return (
            <div className="toplevel">
                <Header/>
                <div className="center" onClick={()=>{
                    window.location.replace('lobby/join');
                }}>
                    <Button name="Join Lobby"/>
                </div>
                <div className="center" onClick={()=>{
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