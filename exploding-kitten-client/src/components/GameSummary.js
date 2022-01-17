import Button from "./Button";

function GameSummary({ label, startGame }) {
  return (
    <div className="game-summary">
      <div>{label}</div>
      <Button
        handleOnClick={startGame}
        className="start-game"
        label="START OVER"
      />
    </div>
  );
}

export default GameSummary;
