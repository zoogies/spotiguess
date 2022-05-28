import "./CreateLobby.css";
import Button from "../Button/Button";
import Dropdown from "../Dropdown/Dropdown";
import "../../Resources/Shared.css";
import Header from "../Header/Header";
import React from "react";
import axios from 'axios';

export default class CreateLobby extends React.Component{

    create() {

        var questiondrop = document.getElementById('questionsdata');
        var questionsdropvalue = questiondrop.options[questiondrop.selectedIndex].value;
        var timespandrop = document.getElementById('timespandata');
        var timespandropvalue = timespandrop.options[timespandrop.selectedIndex].value;

        axios.post('http://'+process.env.REACT_APP_SERVER_ADDRESS + '/createlobby', {
            questions: questionsdropvalue,
            timespan: timespandropvalue
          })
          .then(function (response) {
            window.location.replace('lobby/'+response.data);
          })
          .catch(function (error) {
            console.error(error);
          });

    }

    render(){
        return(
            <div className="toplevel">
                <Header/>
                <div className="center">
                    <h2 className="Label">Questions:</h2>
                    <Dropdown react_id="questionsdata" options={[5,10,15]}/>
                </div>
                <div className="center">
                    <h2 className="Label">Timespan:</h2>
                    <Dropdown react_id="timespandata" options={["short term","medium term","long term"]}/>
                </div>
                <div className="center">
                    <Button name="Create" click={()=>{
                    this.create();
                }}/>
                </div>
                <div className="center">
                    <Button name="Main Menu" click={()=>{
                        window.location.replace('/');
                    }}/>
                </div>
            </div>
        )
    }
}