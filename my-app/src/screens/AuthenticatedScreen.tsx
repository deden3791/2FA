import { useNavigate, useLocation } from "react-router-dom";

export const AuthenticatedScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { time } = location.state || {};

  return (
    <div className="passwordScreen">
      <label>Welcome back!</label>
      <label>Your time was: <b>{time}</b> ms</label>
      <button onClick={() => navigate("/")}>Go back to home screen</button>
    </div>
  );
};
