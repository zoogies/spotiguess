import Button from "../Button/Button";
import Header from "../Header/Header";
import SpotifyLinker from "../SpotifyLinker/SpotifyLinker";
import "./Home.css";

export default function Home(){
    //grab our cached id from local storage
    var clientid = window.localStorage.getItem('spotify_access_token');
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