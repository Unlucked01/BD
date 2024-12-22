import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './LoginPage';
import BookingPage from './BookingPage';
import HistoryPage from './HistoryPage';
import RegisterPage from "./RegisterPage";
import ManageTicketsPage from "./ManageTicketsPage";


function App() {
    const [clientId, setClientId] = useState(null);


    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage setClientId={setClientId}/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/booking" element={<BookingPage clientId={clientId}/>}/>
                <Route path="/history" element={<HistoryPage clientId={clientId}/>}/>
                <Route path="/tickets/manage" element={<ManageTicketsPage clientId={clientId} />} />
            </Routes>
        </Router>
    );
}

export default App;
