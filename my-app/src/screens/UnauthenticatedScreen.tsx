import { useNavigate, useLocation } from "react-router-dom";

export const UnauthenticatedScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { time } = location.state || {};
  return (
    <div className="passwordScreen">
      <label>You have been locked out!</label>
      <label>Your time was: <b>{time}</b></label>
      <button onClick={() => navigate("/")}>Go back to home screen</button>
    </div>
  );
};
