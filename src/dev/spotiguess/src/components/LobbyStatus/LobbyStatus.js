export default function lobbystatus(props){
    if(props.data.length < 4){
        return(
            <h2>Waiting for {4-props.data.length} more players...</h2>
        )
    }
    else{
        //var readyupneeded = 0;
        //check for ready state here
        //props.data.map((player) => {
        //    if(player[Object.keys(player)[0]]['state'] === 'unready'){
        //        readyupneeded +=1
        //    }         
        //})
        return(
            <h2>Waiting for all players to ready...</h2>
        )
    }
}