import { useParams } from "react-router-dom";
import Button from "../Button/Button";
import LobbyStatus from "../LobbyStatus/LobbyStatus";
import Header from "../Header/Header";
import "../../Resources/Shared.css";
import "./Lobby.css";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Game from "../Game/Game";

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
class Lobby extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            players: [],
            state: null,
            questions: [],
            currentquestion: null,
            votes: null,
            currenttime: null,
            lobbyid:props.lobbyid,
            leaderboard:null,
            voted:false,
            reactsucks:true,
            selectedanswer:null,
        }
        this.client = React.createRef();
        this.getleaderboard = this.getleaderboard.bind(this);
        this.sendanswer = this.sendanswer.bind(this);
    }
    componentDidMount(){
        if(window.localStorage.getItem('spotify_username')){
            //console.log(typeof window.localStorage.getItem('spotify_username'))
            //console.log(window.localStorage.getItem('spotify_username'))
        }
        var fuckreact = 0;
        var socket = io(process.env.REACT_APP_SERVER_ADDRESS);
        socket.on('connect_failed', err => console.log(err))
        socket.on("serverconnect", data => {
            if(data['status'] === 'good'){
                this.setState({state:'lobby'})
                //DEBUG TODO
                socket.emit('lobbyupdate',{'action':'join','lobbyid':this.state.lobbyid,'name':window.localStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
                //socket.emit('lobbyupdate',{'action':'join','lobbyid':this.state.lobbyid,'name':window.localStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
            }
            else{
                console.error('error');
            }
        });
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
        socket.on('error', function (err) { 
            console.log("Socket.IO Error"); 
            console.log(err.stack); // this is changed from your code in last comment
         });

        socket.on("lobbyupdate", data => {
            //alert('got a lobbyalert')
            if(data['status'] === 'good'){
                //console.log(data['data'])
                this.setState({players:data['data'],votes:"0/"+data['data'].length});
            }
            else{
                console.error(data['data']);
                console.error(data);
                alert(data['data'])
                window.location.replace('/');
            }
        });

        socket.on("gameupdate", data => {
            //alert('got a lobbyalert')
            if(data['status'] === 'good'){
                //alert('setplayers')
                this.setState({votes:data['data']});
            }
            else{
                console.error(data['data']);
                alert(data['data'])
            }
        });

        socket.on("entergame", data => {
            //alert('got a lobbyalert')
            if(data['status'] === 'good'){
                //alert('setplayers')
                fuckreact = Math.round(Date.now() / 1000) + 20;
                this.setState({questions:data['data'],state:'game',currentquestion:1});
                //console.log('set end to '+fuckreact)
            }
            else{
                console.error(data['data']);
                alert(data['data'])
                window.location.replace('/');
            }
        });

        socket.on("leaderboardresponse", data => {
            //alert('got a lobbyalert')
            if(data['status'] === 'good'){
                this.setState({leaderboard:data['data']})
            }
            else{
                console.error(data['data']);
                alert(data['data'])
                window.location.replace('/');
            }
        });

        setInterval(() => {
            var tm = fuckreact - (Math.round(Date.now() / 1000));
            this.setState({currenttime:tm});
            if(tm >= 0){
                this.setState({currenttime:tm});
            }
            else if(tm < 0 && tm > -5){
                this.setState({currenttime:"Answer:"});
            }
            else{
                //console.log(this.state.currentquestion,this.state.questions.length) //TODO LEFTOFF - decide if post game lobby shows stats or if answer reveal shows answers also investigate new streaming method
                if(this.state.currentquestion === this.state.questions.length){
                    this.setState({state:'postgame'})
                    this.getleaderboard();
                    clearInterval();
                }
                this.setState({currenttime:"Loading Next..."});
                this.setState({selectedanswer:null})
                this.setState({votes:"0/"+this.state.players.length});
                fuckreact = Math.round(Date.now() / 1000) + 20;
                this.setState({currentquestion:this.state.currentquestion + 1});
                this.setState({voted:false});
            }
        }, 1000);

        this.client.current = socket;

        window.onbeforeunload = function () {
            socket.emit('client_disconnecting', {'lobbyid':this.state.lobbyid,'token':this.state.token,'username':window.localStorage.getItem('spotify_username')});
        }
    }

    getleaderboard(){
        this.client.current.emit('lobbyupdate', {'action':'getleaderboard','lobbyid':this.state.lobbyid});
    }

    sendanswer = (answer) => {
        //alert(answer)
        this.setState({voted:true})
        this.setState({selectedanswer:answer})
        this.client.current.emit('lobbyupdate',{'answer':answer,'question':this.state.currentquestion,'action':'vote','lobbyid':this.state.lobbyid,'name':window.localStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
    }

    render(){
        if(this.state.state === 'lobby'){
            if(typeof this.state.players === 'object'){
                return(
                    <div className="toplevel">
                        <Header/>
                        <h2 className="center codelabel">Lobby Code:</h2>
                        <h1 className="center lobbycode">{this.state.lobbyid}</h1>
        
                        <div className="center">
                            <LobbyStatus data={this.state.players}/>
                        </div>
        
                        <h2 className="center playerlabel">Players:</h2>
        
                        <div className="center playerlist">
                            {
                                    this.state.players.map((player) => {
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
        
                        <div id='readybutton' className="center">
                            <Button name="Ready" click={()=>{
                                //DEBUG TODO client.current.emit('lobbyupdate',{'action':'ready','lobbyid':props.lobbyid,'name':window.localStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
                                this.client.current.emit('lobbyupdate',{'action':'ready','lobbyid':this.state.lobbyid,'name':window.localStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
                                document.getElementById('readybutton').remove();
                            }}/>
                        </div>
                        <div className="center">
                            <Button name="Leave" click={()=>{
                                // DEBUG TODO client.current.emit('lobbyupdate',{'action':'leave','lobbyid':props.lobbyid,'name':window.localStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
                                this.client.current.emit('lobbyupdate',{'action':'leave','lobbyid':this.state.lobbyid,'name':window.localStorage.getItem('spotify_username'),'token':window.localStorage.getItem('spotify_access_token')})
                                window.location.replace('/');
                            }}/>
                        </div>
                    </div>
            )
            }
            else{
                return <p>loading...</p>
            }
        }
        else if(this.state.state === 'game'){
            return <Game selectedanswer={this.state.selectedanswer} currenttime={this.state.currenttime} voted={this.state.voted} votes={this.state.votes} call={this.sendanswer} answers={this.state.questions[this.state.currentquestion - 1]['answers']} srcc={this.state.questions[this.state.currentquestion - 1]} questionnum={this.state.currentquestion} questionamount={this.state.questions.length}/>
        }
        else if(this.state.state === 'postgame' && this.state.leaderboard !== null){
            return(
                <div className="toplevel">
                    <Header/>
                    <h1 className="center">Results:</h1>
                    <div className="center leaderboard">
                        {
                            Object.keys(this.state.leaderboard).map((keyname,i) => { //TODO IT DONT LIKIE THIS
                                return (
                                    <div className="player slightshadow center level2" key={i}>
                                        <h3>{keyname} - {this.state.leaderboard[keyname]}/{this.state.questions.length}</h3>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="center">
                        <Button name="Exit" click={()=>{
                        window.location.replace('/');  //TODO ALLOW RETURNING TO LOBBY AND URGENT TODO REMOVE LOBBY PEOPLE AFTER GAME
                    }}/>
                    </div>
                </div>
            )
        }
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
            <div className="center">
                <Button name="Join" click={()=>{
                    var cachedid = document.getElementById('codeinput').value;
                    axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/checklobbyexists', {
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
                        console.error(error);
                        alert("Something went wrong. Please make sure you have entered a valid 5 digit number.")
                      });
                }}/>
            </div>
            <div className="center">
                <Button name="Main Menu" click={()=>{
                    window.location.replace('/');
                }}/>
            </div>
        </div>
    )
}