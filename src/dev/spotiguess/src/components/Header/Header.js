import {BsSpotify} from "react-icons/bs";
import "./Header.css";
export default function Header(){
    return(
        <div className="Title">
                <BsSpotify size={60} color={"#1DB954"} />
                <h1 className="Home_Title">SpotiGuess</h1>
        </div>
    )
}