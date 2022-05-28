import "../../Resources/Shared.css";
import "./Button.css";

export default function Button(props){
    return (
        <div className="level2 Button shadow" onClick={props.click}>
            <h2>{props.name}</h2>
        </div>
    );
}