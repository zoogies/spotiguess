export default function lobbystatus(props){
    if(props.data.length < 4){
        return(
            <h2>Waiting for {4-props.data.length} more players...</h2>
        )
    }
    else{
        var readyupneeded = 0;

        props.data.map((player) => {
            if(player[Object.keys(player)[0]]['state'] === 'unready'){
                readyupneeded +=1
            }         
        })
        if(readyupneeded !== 0){
            return(
                <h2>Waiting for all players to ready...</h2>
            )
        }
        else{
            return(
                <div className="lobbystatus">
                    <h2 className="lobbystatustop">Creating game...</h2>
                    <p className="lobbystatusbottom">please be patient, my servers are weak</p>
                </div>
            )
        }
    }
}