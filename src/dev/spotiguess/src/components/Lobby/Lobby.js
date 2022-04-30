import { useParams } from "react-router-dom";
import Button from "../Button/Button";
import Header from "../Header/Header";
import "../../Resources/Shared.css";
import "./Lobby.css";

export default function LobbyWrapper(){
    const {lobbyid} = useParams();

    if(lobbyid === 'join'){
        return <JoinLobby/>
    }
    else{
        return <Lobby players={['mitsuri','talking ben','goth mommy dommy']} lobbyid={lobbyid} />
    }
}

function Lobby(props){
    return(
        <div className="toplevel">
            <Header/>
            <h2 className="center codelabel">Lobby Code:</h2>
            <h1 className="center lobbycode">{props.lobbyid}</h1>
            <h2 className="center playerlabel">Players:</h2>

            <div className="center playerlist">
                {
                    props.players.map((player) => {
                        return(
                            <div className="player slightshadow center level2" key={player}>
                                <h3>{player}</h3>
                            </div>
                        )
                    })
                }
            </div>

            <div className="center" onClick={()=>{
                    //
                }}>
                <Button name="Ready"/>
            </div>
            <div className="center" onClick={()=>{
                    window.location.replace('/');
                }}>
                <Button name="Leave"/>
            </div>
        </div>
    )
}

function JoinLobby(){
    return(
        <div className="JoinLobby">
            <Header/>
            <div className="center">
                <input type="number" id="codeinput" className="codeinput shadow" maxLength={6} placeholder="LOBBY CODE"></input>
            </div>
            <div className="center" onClick={()=>{
                    //window.location.replace('/lobby/'+document.getElementById('codeinput').value);
                }}>
                <Button name="Join"/>
            </div>
            <div className="center" onClick={()=>{
                    window.location.replace('/');
                }}>
                <Button name="Main Menu"/>
            </div>
        </div>
    )
}