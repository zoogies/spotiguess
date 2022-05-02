import { useParams } from "react-router-dom";
import Button from "../Button/Button";
import Header from "../Header/Header";
import "../../Resources/Shared.css";
import "./Lobby.css";
import axios from "axios";

export default function LobbyWrapper(){
    const {lobbyid} = useParams();

    if(lobbyid === 'join'){
        return <JoinLobby/>
    }
    else{
        return <Lobby players={['mitsuri','talking ben','goth mommy dommy']} lobbyid={lobbyid} />
    }
}

// https://python-socketio.readthedocs.io/en/latest/server.html
// https://www.atatus.com/blog/websockets-tutorial-going-real-time-with-node-and-react/

//probably going to have to open websockets and shit here, turning this into a class component and handling its state with multiple returns in the render
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
//probably needs to be a class component so it doesent run request twice TODO
function JoinLobby(){
    return(
        <div className="JoinLobby">
            <Header/>
            <div className="center">
                <input type="number" id="codeinput" className="codeinput shadow" maxLength={6} placeholder="LOBBY CODE"></input>
            </div>
            <div className="center" onClick={()=>{
                    var cachedid = document.getElementById('codeinput').value;
                    axios.post('http://'+process.env.REACT_APP_SERVER_ADDRESS + '/checklobbyexists', {
                        lobbyid: cachedid
                      })
                      .then(function (response) {
                          if(response.data === true){
                            window.location.replace('/lobby/'+cachedid);
                          }
                          else{
                              alert('This lobby does not exist!')
                          }
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
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