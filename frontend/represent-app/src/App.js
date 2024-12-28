import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage";
import ManageFlightsPage from "./pages/ManageFlightsPage";
import StatsPage from "./pages/Stats";

import 'bootstrap/dist/css/bootstrap.css';

function App() {
    const [airlineID, setAirlineId] = useState(null);


    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage setAirlineId={setAirlineId}/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/flights" element={<ManageFlightsPage airlineID={airlineID} />} />
                <Route path="/stats" element={<StatsPage airlineID={airlineID} />} />
            </Routes>
        </Router>
    );
}

export default App;
