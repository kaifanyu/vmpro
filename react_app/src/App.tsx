import { Routes, Route } from 'react-router-dom';
import GuestCheckIn from './routes/GuestCheckIn';
import CheckInSuccess from './routes/CheckInSuccess';
import CameraPage from './routes/Camera';
import LandingPage from './routes/Landing';
import EmployeeCheckIn from './routes/EmployeeCheckIn';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/guest-checkin" element={<GuestCheckIn />} />
      <Route path="/employee-checkin" element={<EmployeeCheckIn />} />
      <Route path="/success" element={<CheckInSuccess />} />
      <Route path="/camera" element={<CameraPage />} />
    </Routes>
  );
}

export default App;
