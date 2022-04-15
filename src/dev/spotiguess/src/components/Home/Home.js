import Button from "../Button/Button";
import "./Home.css";
import {BsSpotify} from "react-icons/bs";

export default function Home(){
    return (
        <div className="Home">
            <div className="Title">
                <BsSpotify size={60} color={"#1DB954"} />
                <h1 className="Home_Title">SpotiGuess</h1>
            </div>
            <div className="MenuButton">
                <Button name="Join Lobby"/>
            </div>
            <div className="MenuButton">
                <Button name="Create Lobby"/>
            </div>
            <div className="MenuButton">
                <Button name="Settings"/>
            </div>
        </div>
    )
}