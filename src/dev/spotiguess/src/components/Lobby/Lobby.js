import { useParams } from "react-router-dom";
import Button from "../Button/Button";
import Header from "../Header/Header";
import "../../Resources/Shared.css";
import "./Lobby.css";

export default function Lobby(){
    const {lobbyid} = useParams();

    if(lobbyid === 'join'){
        return <JoinLobby/>
    }
    else{
        return <Lobby lobbyid={lobbyid} />
    }
}

function JoinLobby(){
    return(
        <div className="JoinLobby">
            <Header/>
            <div className="center">
                <input type="number" className="codeinput shadow" maxLength={6} placeholder="LOBBY CODE"></input>
            </div>
            <div className="center" onClick={()=>{
                    window.location.replace('/');
                }}>
                <Button name="Main Menu"/>
            </div>
        </div>
    )
}