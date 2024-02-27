import { useNavigate } from "react-router-dom";

export const AuthenticatedScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="passwordScreen">
      <label>Welcome back!</label>
      <button onClick={() => navigate("/")}>Go back to home screen</button>
    </div>
  );
};
