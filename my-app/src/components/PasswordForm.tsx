import { useState } from "react";
import PasswordChecklist from "react-password-checklist";
import { useNavigate } from "react-router-dom";

export const PasswordForm = () => {
  const navigate = useNavigate();
  const masterPassword = "ilovegroupt";
  const [password, setPassword] = useState<string>("");
  const [passwordCorrect, setPasswordCorrect] = useState<boolean>(false);

  const updatePasswordCorrect = (
    isValid: boolean,
    failedRules: string[]
  ): void => {
    isValid ? setPasswordCorrect(true) : setPasswordCorrect(false);
  };

  const checkPassword = (): void => {
    if (passwordCorrect) navigate("/chess");
  };

  return (
    <div className="passwordScreen">
      <label>
        Master Password is: <i>{masterPassword}</i>
      </label>

      <form className="passwordForm">
        <label>Enter Password:</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />

        <div className="passwordChecklist">
          <PasswordChecklist
            rules={["match"]}
            value={masterPassword}
            valueAgain={password}
            onChange={(isValid, failedRules) =>
              updatePasswordCorrect(isValid, failedRules)
            }
            messages={{
              match: "Passwords must match.",
            }}
          />
        </div>
      </form>

      <button onClick={() => checkPassword()} disabled={!passwordCorrect}>
        Enter
      </button>
    </div>
  );
};
