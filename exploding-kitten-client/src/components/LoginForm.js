import { useState } from "react";
import superagent from "superagent";
import Button from "./Button";

function LoginForm({ handleStartGame }) {
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const startGame = () => {
    if (userName) {
      setErrorMessage("");
      (async () => {
        try {
          const res = await superagent.post(
            `${process.env.REACT_APP_BACKEND_SERVER_URL}/login`,
            {
              userName: userName,
            }
          );
          if (res.body.requestSuccess) {
            window.sessionStorage.setItem("userName", userName);
            handleStartGame(true);
          }
        } catch (err) {
          console.error(err);
        }
      })();
    } else {
      setErrorMessage("Username Required...");
    }
  };

  const handleChange = (event) => {
    setUserName(event.target.value);
    if (event.target.value) {
      setErrorMessage("");
    }
  };

  return (
    <div className="start-game-form-container">
      <div className="left-bar"></div>
      <div className="form-content">
        <div className="form-container">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required="required"
              value={userName}
              onChange={handleChange}
            />
          </div>
          <div className="validation-message">{errorMessage}</div>
          <Button
            handleOnClick={startGame}
            className="start-game"
            label="START GAME"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
