import { Routes, Route } from 'react-router-dom';
import GuestCheckIn from './routes/GuestCheckIn';
import CheckInSuccess from './routes/CheckInSuccess';
import CameraPage from './routes/Camera';
import LandingPage from './routes/Landing';
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/visitor" element={<GuestCheckIn />} />
      <Route path="/success" element={<CheckInSuccess />} />
      <Route path="/camera" element={<CameraPage />} />
    </Routes>
  );
}

export default App;
