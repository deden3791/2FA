import { ChessSceen } from "./screens/ChessScreen";
import { PasswordScreen } from "./screens/PasswordScreen";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PasswordScreen />} />
        <Route path="/chess" element={<ChessSceen />} />
      </Routes>
    </Router>
  );
}

export default App;
