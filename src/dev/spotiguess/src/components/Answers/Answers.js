export default function Answers(props){
    if(props.voted !== false){
        return (
            <p>PLACEHOLDER LOADING</p>
        )
    }
    else{
        if(props.currenttime !== 'Loading Next...' && props.currenttime !== 'Answer:'){
            var fuckyou  = Object.keys(props.answers).sort().reduce((r, k) => (r[k] = props.answers[k], r), {});
            //console.log(fuckyou,typeof fuckyou)
            return(
                Object.keys(fuckyou).map(function(key, index) {
                    return <h2 key={index} className="level2 shadow answerbtn" onClick={()=>{props.call(key);}}>{key}</h2>
                })
            )
        }
        else{

            return(
                <p>maybe you got it right maybe not</p>
            )
        }
    }
}