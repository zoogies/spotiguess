import "../../Resources/Shared.css";
import "./Button.css";

export default function Button(props){
    return (
        <div className="level2 Button shadow">
            <h2>{props.name}</h2>
        </div>
    );
}