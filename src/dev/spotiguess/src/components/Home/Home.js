import Button from "../Button/Button";
import Header from "../Header/Header";
import "./Home.css";

export default function Home(){
    return (
        <div className="toplevel">
            <Header/>
            <div className="center" onClick={()=>{
                window.location.replace('lobby/join');
            }}>
                <Button name="Join Lobby"/>
            </div>
            <div className="center" onClick={()=>{
                window.location.replace('create');
            }}>
                <Button name="Create Lobby"/>
            </div>
            <div className="center">
                <Button name="Settings"/>
            </div>
        </div>
    )
}