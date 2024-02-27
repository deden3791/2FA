import {
  PasswordScreen,
  ChessScreen,
  AnagramScreen,
  CardCountingScreen,
  AuthenticatedScreen,
  UnauthenticatedScreen,
} from "./screens";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PasswordScreen />} />
        <Route path="/chess" element={<ChessScreen />} />
        <Route path="/anagram" element={<AnagramScreen />} />
        <Route path="/cards" element={<CardCountingScreen />} />
        <Route path="/authenticated" element={<AuthenticatedScreen />} />
        <Route path="/unauthenticated" element={<UnauthenticatedScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
