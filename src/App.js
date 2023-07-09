// import "./App.css";
import EventDetails from "./pages/EventDetails/EventDetails";
import Homepage from "./pages/Homepage/Homepage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/etkinlik/:id" element={<EventDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
