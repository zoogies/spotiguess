import axios from "axios"
import React from "react";
import { useEffect } from "react";
import getepoch from "../../Resources/utcepoch";

export default function Callback(props){
    const code = new URLSearchParams(window.location.search).get('code')
    useEffect(()=>{
        axios.post('http://'+process.env.REACT_APP_SERVER_ADDRESS + '/gentoken', {
            code: code
          })
          .then(function (response) {
            response = JSON.parse(response.data);
            if(typeof response['error'] === 'string'){
                alert('An error has occurred.')
            }
            else{
                //console.log(response)
                window.sessionStorage.setItem('spotify_access_token',response['access_token']);
                window.sessionStorage.setItem('spotify_refresh_token',response['refresh_token']);
                window.sessionStorage.setItem('spotify_token_expires',response['expires_in'] + getepoch());
                window.location.replace('/');
            }
          })
          .catch(function (error) {
            console.error(error);
            window.location.replace('/');
         });
    }, []) // <-- empty dependency array
    

    return(
        <p>Generating your token... Please wait</p>
    )
}