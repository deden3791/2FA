import { PasswordScreen, PuzzleScreen, AuthenticatedScreen, UnauthenticatedScreen } from "./screens";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PasswordScreen />} />
        <Route path="/puzzle" element={<PuzzleScreen />} />
        <Route path="/authenticated" element={<AuthenticatedScreen />} />
        <Route path="/unauthenticated" element={<UnauthenticatedScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
