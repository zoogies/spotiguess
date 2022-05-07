import { useParams } from "react-router-dom";
import Button from "../Button/Button";
import LobbyStatus from "../LobbyStatus/LobbyStatus";
import Header from "../Header/Header";
import "../../Resources/Shared.css";
import "./Lobby.css";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";

export default function LobbyWrapper(){
    const {lobbyid} = useParams();

    if(lobbyid === 'join'){
        return <JoinLobby/>
    }
    else{
        return <Lobby lobbyid={lobbyid} />
    }
}

// https://python-socketio.readthedocs.io/en/latest/server.html
// https://www.atatus.com/blog/websockets-tutorial-going-real-time-with-node-and-react/
// https://www.youtube.com/watch?v=NwHq1-FkQpU&ab_channel=CodingWithChaim
// https://www.youtube.com/watch?v=o8x-nLc-V4o&list=PLK0STOMCFms7jQEKo89pHdkO_QdSjDs0t&index=3&ab_channel=CodingWithChaim

//probably going to have to open websockets and shit here, turning this into a class component and handling its state with multiple returns in the render
function Lobby(props){
    const [response, setResponse] = useState("");
    const [players, setPlayers] = useState("");
    const [state, setState] = useState("");
    const client = useRef();

    useEffect(() => {
        var socket = socketIOClient("ws://127.0.0.1:5000");
        socket.on("serverconnect", data => {
            if(data['status'] === 'good'){
                setResponse(data);
                setState('lobby');
                //DEBUG TODO
                //socket.emit('lobbyupdate',{'action':'join','lobbyid':props.lobbyid,'name':window.localStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
                socket.emit('lobbyupdate',{'action':'join','lobbyid':props.lobbyid,'name':window.sessionStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
            }
            else{
                console.log('error');
            }
        });

        socket.on("lobbyupdate", data => {
            //alert('got a lobbyalert')
            if(data['status'] === 'good'){
                //alert('setplayers')
                setPlayers(data['data']);
            }
            else{
                console.error(data['data']);
                alert(data['data'])
                window.location.replace('/');
            }
        });
        client.current = socket;
    }, []);
    if(state === 'lobby'){
        if(typeof players === 'object'){
            return(
                <div className="toplevel">
                    <Header/>
                    <h2 className="center codelabel">Lobby Code:</h2>
                    <h1 className="center lobbycode">{props.lobbyid}</h1>
    
                    <div className="center">
                        <LobbyStatus data={players}/>
                    </div>
    
                    <h2 className="center playerlabel">Players:</h2>
    
                    <div className="center playerlist">
                        {
                                players.map((player) => {
                                    console.log()
                                    if(player[Object.keys(player)[0]]['state'] === 'unready'){
                                        return(
                                            <div className="player slightshadow center level2" key={Object.keys(player)[0]}>
                                                <h3>{Object.keys(player)[0]}</h3>
                                            </div>
                                        )
                                    }
                                    else{
                                        return(
                                            <div className="player slightshadow center highlight1" key={Object.keys(player)[0]}>
                                                <h3>{Object.keys(player)[0]}</h3>
                                            </div>
                                        )
                                    }
                                    
                                })
                        }
                    </div>
    
                    <div id='readybutton' className="center" onClick={()=>{
                            //DEBUG TODO client.current.emit('lobbyupdate',{'action':'ready','lobbyid':props.lobbyid,'name':window.localStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
                            client.current.emit('lobbyupdate',{'action':'ready','lobbyid':props.lobbyid,'name':window.sessionStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
                            document.getElementById('readybutton').remove();
                        }}>
                        <Button name="Ready"/>
                    </div>
                    <div className="center" onClick={()=>{
                            // DEBUG TODO client.current.emit('lobbyupdate',{'action':'leave','lobbyid':props.lobbyid,'name':window.localStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
                            client.current.emit('lobbyupdate',{'action':'leave','lobbyid':props.lobbyid,'name':window.sessionStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
                            window.location.replace('/');
                        }}>
                        <Button name="Leave"/>
                    </div>
                </div>
        )
        }
        else{
            return <p>loading...</p>
        }
    }
    else if(state === 'game'){
        return(
            <p>GAME OMG!!</p>
        )
    }
}





//get this tf out my way







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
                        alert("Something went wrong. Please make sure you have entered a valid 5 digit number.")
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