export default function Answers(props){
    if(props.currenttime !== 'Loading Next...' && props.currenttime !== 'Answer:'){
        if(props.voted === false){
            var fuckyou  = Object.keys(props.answers).sort().reduce((r, k) => (r[k] = props.answers[k], r), {});
            //console.log(fuckyou,typeof fuckyou)
            return(
                Object.keys(fuckyou).map(function(key, index) {
                    return <h2 key={index} className="level2 shadow answerbtn" onClick={()=>{props.call(key);}}>{key}</h2>
                })
            )
        }
        else if(props.currenttime !== 'Loading Next...' && props.currenttime !== 'Answer:'){
            return (
                <h2>Waiting for question to end...</h2>
            )
        }
    }
    else if(props.currenttime !== 'Loading Next...'){
        return(
            <p>maybe you got it right maybe not</p>
        )
    }
}