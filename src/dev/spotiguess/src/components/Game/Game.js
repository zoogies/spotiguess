import "../../Resources/Shared.css"
import Header from "../Header/Header"
import "./Game.css"
import {BsSpotify} from "react-icons/bs";
import Answers from "../Answers/Answers";

export default function Game(props){
    return(
        <div className="toplevel">
            <div className="progressbar level2 shadow">
                <BsSpotify className="gamelogo" size={60} color={"#1DB954"} />
                <h1 className="questionlabel">Question: {props.questionnum}/{props.questionamount}</h1>
            </div>
            <div className="questionlabel center">
                <h2>Who has listened to this song the most?</h2>
            </div>
            <div className="center gamestatus">
                <h1 className="timer">{props.currenttime}</h1>
                <h2 className="votes">{props.votes} votes</h2>
            </div>
            <div className="toplevel center">
                <iframe
                title="balls" className="spotifyembed" src={props.srcc['song']} width="100%" height={380} frameBorder={0} allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
            </div>
            <div className="toplevel center answers">
                <Answers selectedanswer={props.selectedanswer} questionnum={props.questionnum} voted={props.voted} answers={props.answers} currenttime={props.currenttime} call={props.call}/>
            </div>
        </div>
    )
}