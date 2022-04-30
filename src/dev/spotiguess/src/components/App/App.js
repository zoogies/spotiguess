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

function App(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/create" element={<CreateLobby/>}/>
                <Route path="/lobby/:lobbyid" element={<Lobby/>}/>
                <Route path="*" element={<Notfound/>}/>
            </Routes>
        </Router>
    );
}
export default App;