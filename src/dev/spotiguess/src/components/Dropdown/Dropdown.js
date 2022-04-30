import "./Dropdown.css"
export default function Dropdown(props){
    return(
        <div className="Dropdown">
            <select id={props.react_id} className="Select">
                {
                    props.options.map((op) => {
                        return(
                            <option key={op} value={op}>{op}</option>
                        )
                    })
                }
            </select>
        </div>
    )
}