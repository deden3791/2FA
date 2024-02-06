import { useState } from 'react';
import { PasswordForm } from './PasswordForm';
import { ChessPassword } from './ChessPassword';
import "../App.css";

export const PasswordScreen = () => {
  const [show2fa, setShow2fa] = useState<boolean>(false);


  return (
    <div>
      {show2fa ? (
        <ChessPassword
          problemNo={1}
        />
      ) : (
        <PasswordForm 
          updateShow2fa={setShow2fa}
        />
      )}
    </div>
  );
}