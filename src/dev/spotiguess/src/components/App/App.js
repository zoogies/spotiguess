import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";

import Notfound from "../Notfound/Notfound";
import Home from "../Home/Home";
import "../../Resources/Shared.css";

function App(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="*" element={<Notfound/>}/>
            </Routes>
        </Router>
    );
}
export default App;