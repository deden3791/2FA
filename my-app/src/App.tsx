import { ChessSceen } from "./screens/ChessScreen";
import { PasswordScreen } from "./screens/PasswordScreen";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import AuthenticatedScreen from "./screens/AuthenticatedScreen";
import UnauthenticatedScreen from "./screens/UnauthenticatedScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PasswordScreen />} />
        <Route path="/chess" element={<ChessSceen />} />
        <Route path="/authenticated" element={<AuthenticatedScreen />} />
        <Route path="/unauthenticated" element={<UnauthenticatedScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
