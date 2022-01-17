import { useEffect } from "react";
import Button from "./Button";

function LeaderBoard({ data, getLeaderBoardDetails }) {
  const loggedUserName = window.sessionStorage.getItem("userName");

  useEffect(() => {
    getLeaderBoardDetails();
  }, []);

  const refreshLeaderBoard = () => {
    getLeaderBoardDetails();
  };

  return (
    <table>
      <thead>
        <tr>
          <td colSpan={4}>Playing: {loggedUserName}</td>
        </tr>
        <tr>
          <th>Username</th>
          <th>Total Game</th>
          <th>Won</th>
          <th>Lost</th>
        </tr>
      </thead>
      <tbody>
        {data.map((board) => {
          return (
            <tr
              key={board.userName}
              className={
                board.userName === loggedUserName ? "loggedin-user" : ""
              }
            >
              <th>{board.userName}</th>
              <th>{board.win + board.loose}</th>
              <th>{board.win}</th>
              <th>{board.loose}</th>
            </tr>
          );
        })}
        <tr>
          <td colSpan="4">
            <div>
              <Button
                handleOnClick={refreshLeaderBoard}
                className="start-game"
                label="REFRESH"
              />
              <p>Refresh periodically to get latest results.</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default LeaderBoard;
