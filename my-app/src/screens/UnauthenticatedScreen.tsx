import { useNavigate } from "react-router-dom";

export const UnauthenticatedScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="passwordScreen">
      <label>You have been locked out!</label>
      <button onClick={() => navigate("/")}>Go back to home screen</button>
    </div>
  );
};
