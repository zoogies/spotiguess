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
        var answer = Object.keys(props.answers).find(key => props.answers[key] === 'correct');
        if(props.selectedanswer === answer){
            return(
                <h2 className="center correctanswertext">Correct! It was {answer}</h2>
            )
        }
        else{
            return(
                <h2 className="center wronganswertext">Wrong! It was {answer}</h2>
            )
        }
    }
}