import { useState } from "react";
import { useNavigate } from "react-router-dom";

const chessPassword = "ilovechess";
const anagramPassword = "iloveanagrams";
const cardPassword = "ilovecards";

export const PasswordForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const checkPassword = (): void => {
    if (password === chessPassword) navigate("/chess");
    else if (password === anagramPassword) navigate("/anagram");
    else if (password === cardPassword) navigate("/cards");
    else setMessage("Incorrect password");
  };

  const onFormSubmit = (e: any): void => {
    e.preventDefault();
    checkPassword();
  };

  return (
    <div className="passwordScreen">
      <label>
        Chess: <i>{chessPassword}</i>
      </label>
      <label>
        Anagram: <i>{anagramPassword}</i>
      </label>
      <label>
        Card Counting: <i>{cardPassword}</i>
      </label>

      <form className="passwordForm" onSubmit={onFormSubmit}>
        <label>Enter Password:</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />

        <label>{message}</label>
        <button type="submit">Enter</button>
      </form>
    </div>
  );
};
