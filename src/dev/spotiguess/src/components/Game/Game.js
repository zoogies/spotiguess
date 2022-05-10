import "../../Resources/Shared.css"
import Header from "../Header/Header"
import "./Game.css"
import {BsSpotify} from "react-icons/bs";
import { useEffect, useState } from "react";

export default function Game(props){
    //TODO USE SOME BULLSHIT STATE HOOK TO LOCK ANSWERS WHEN ONE CLICKED
    useEffect(() => { 
    });

    return(
        <div className="toplevel">
            <div className="progressbar level2 shadow">
                <BsSpotify className="gamelogo" size={60} color={"#1DB954"} />
                <h1 className="questionlabel">Question: {props.questionnum}/{props.questionamount}</h1>
            </div>
            <div className="questionlabel center">
                <h2>Who has listened to this song the most?</h2>
            </div>
            <div>
                <h2>{props.votes} votes</h2>
                <h2>{props.currenttime}</h2>
            </div>
            <div className="toplevel center">
                <iframe
                title="balls" className="spotifyembed" src={props.srcc['song']} width="100%" height={380} frameBorder={0} allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
            </div>
            <div className="toplevel center answers">
                {
                    Object.keys(props.answers).map(function(keyName, keyIndex) {
                        // use keyName to get current key's name
                        // and a[keyName] to get its value
                        //if(props.answers[keyName] === 'correct'){
                        if(true){ //DEBUG TODO THIS NEEDS TO CHECK IF QUESTION HAS ENDED
                            return(
                                <h2 id={keyIndex} key={keyIndex} className="level2 shadow answerbtn" onClick={()=>{
                                    document.querySelectorAll('.selected').forEach(function(e) {
                                        e.classList.remove("selected")
                                    });
                                    document.getElementById(keyIndex).classList.add("selected");
                                    props.call();
                                }}>{keyName}</h2>
                            )
                        }
                        //else{
                        //
                        //}

                      })
                }
            </div>
        </div>
    )
}