import "../../Resources/Shared.css"
import Header from "../Header/Header"
import "./Game.css"
import {BsSpotify} from "react-icons/bs";

export default function Game(props){
    console.log(props.srcc)
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
                <iframe title="balls" src={props.srcc['song']} width="100%" height={380} frameBorder={0} allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
            </div>
        </div>
    )
}