import "./CreateLobby.css";
import Button from "../Button/Button";
import Dropdown from "../Dropdown/Dropdown";
import "../../Resources/Shared.css";
import Header from "../Header/Header";

export default function CreateLobby(){
    return(
        <div className="toplevel">
            <Header/>
            <div className="center">
                <h2 className="Label">Questions:</h2>
                <Dropdown options={[5,10,15]}/>
            </div>
            <div className="center">
                <h2 className="Label">Timespan:</h2>
                <Dropdown options={["short term","medium term","long term"]}/>
            </div>
            <div className="center">
                <Button name="Create"/>
            </div>
            <div className="center" onClick={()=>{
                    window.location.replace('/');
                }}>
                <Button name="Main Menu"/>
            </div>
        </div>
    )
}