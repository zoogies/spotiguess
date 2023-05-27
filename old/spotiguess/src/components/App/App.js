import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";

import Notfound from "../Notfound/Notfound";
import Home from "../Home/Home";
import "../../Resources/Shared.css";
import CreateLobby from "../CreateLobby/CreateLobby";
import Lobby from "../Lobby/Lobby";
import Callback from "../Callback/Callback";

function App(){
    if(window.localStorage.getItem('spotify_access_token') !== null || window.location.pathname === '/callback'){
        return(
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/create" element={<CreateLobby/>}/>
                    <Route path="/lobby/:lobbyid" element={<Lobby/>}/>
                    <Route path="/callback" element={<Callback/>}/>
                    <Route path="*" element={<Notfound/>}/>
                </Routes>
            </Router>
        );
    }
    else{
        if(window.location.pathname === '/'){
            return <Home/>
        }
        else{
            window.location.href = "/";
        }
    }
    
}
export default App;