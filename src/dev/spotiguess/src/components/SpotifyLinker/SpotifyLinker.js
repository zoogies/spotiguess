import "../Button/Button.css";
import "../../Resources/Shared.css";
import {AiFillWarning} from "react-icons/ai";
import "./SpotifyLinker.css";
import {BsSpotify} from "react-icons/bs";
import { loginUrl } from "../../Resources/spotify";

export default function SpotifyLinker(){
    //grab our cached id from local storage
    var clientid = window.sessionStorage.getItem('spotify_access_token');
    //check if its longer than 0 trimmed of whitespace and if its not null
    if(clientid !== null && clientid.trim(' ').length > 0){
        return(
            <div className="Button highlight2 shadow" onClick={()=>{
                //clears the key from cache and reloads the site
                window.sessionStorage.clear();
                window.location.reload();
            }}>
                <h2>Unlink Spotify</h2>
            </div>
        )
    }
    else{
        return(
            <div className="center Link" onClick={()=>{
                window.location.href = (loginUrl);
            }}>
            <div className="Button highlight1 shadow">
                <BsSpotify className="spotify_link_icon" size={40} color="white" />
                <h2>Link Spotify</h2>
            </div>
            <div className="warning_top">
                <AiFillWarning className="warning_icon" color="yellow" size={30}/>
                <h2 className="warning_lbl">Link your spotify to play.</h2>
            </div>
            </div>
        )
    }
}