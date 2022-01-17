import { useState, useEffect } from "react";
import superagent from "superagent";
import Confetti from "react-confetti";
import Card from "./components/Card";
import DeckDetails from "./components/DeckDetails";
import LeaderBoard from "./components/LeaderBoard";
import LoginForm from "./components/LoginForm";
import GameSummary from "./components/GameSummary";
import { GenerateDeckOfCards } from "./utils/CardUtilities";

function App() {
  const [gameStart, setgameStart] = useState(false);
  const [deck, setDeck] = useState(GenerateDeckOfCards());
  const [cardDrawnEnabled, setCardDrawnEnabled] = useState(true);
  const [withdrawedCard, setWithdrawedCard] = useState([]);
  const [highlight, setHighlight] = useState({
    action: "NOTHING",
    message: "Game started. Click on the Deck to Play.",
  });
  const [leaderBoard, setLeaderBoard] = useState([]);

  const getLeaderBoardResults = () => {
    (async () => {
      try {
        const res = await superagent.get(
          `${process.env.REACT_APP_BACKEND_SERVER_URL}/leaderboard`
        );
        if (res.body.data) {
          setLeaderBoard(res.body.data);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  };

  useEffect(() => {
    if (deck.length <= 0) {
      setHighlight({
        action: "MATCH_WIN",
        message: "Hola!. You have Won the match.",
      });
      saveGame(true);
    }
  }, [deck]);

  const handleStartGame = (status) => {
    setgameStart(status);
  };

  const removeCardFromDeck = (removedWithdrawnCard) => {
    setDeck(removedWithdrawnCard);
    setCardDrawnEnabled(true);
  };

  const drawCard = (index) => {
    if (cardDrawnEnabled) {
      const updateDrawedCardStatus = deck.map((card, i) => {
        return index === i ? { ...card, isDrawn: true } : card;
      });
      const removedWithdrawnCard = updateDrawedCardStatus.filter((card) => {
        return !card.isDrawn;
      });
      // Logic
      const withdrawnCard = deck[index] || [];
      setDeck(updateDrawedCardStatus);
      setWithdrawedCard([...withdrawedCard, withdrawnCard]);
      setCardDrawnEnabled(false);
      setTimeout(() => {
        switch (withdrawnCard.identity) {
          case "CAT":
          case "DEFUSE":
            removeCardFromDeck(removedWithdrawnCard);
            break;
          case "SHUFFLE":
            resetGame();
            break;
          case "EXPLODDING":
            explodeGame(removedWithdrawnCard);
            break;

          default:
            break;
        }
      }, 2000);
    }
  };

  const resetGame = () => {
    const reaarangeDeck = GenerateDeckOfCards();
    setDeck(reaarangeDeck);
    setCardDrawnEnabled(true);
    setHighlight({ action: "NOTHING", message: "Game Restarted." });
    setWithdrawedCard([]);
  };

  const explodeGame = (removedWithdrawnCard) => {
    const lastCard = withdrawedCard[withdrawedCard.length - 1];
    const isLastDefuseCard = lastCard ? lastCard.identity === "DEFUSE" : false;
    if (!isLastDefuseCard) {
      setHighlight({
        action: "EXPLODE",
        message: "Game Exploded. Beter luck next time.",
      });
      setTimeout(() => {
        saveGame(false);
      }, 2000);
    } else {
      removeCardFromDeck(removedWithdrawnCard);
    }
  };

  const saveGame = (isWinner) => {
    (async () => {
      try {
        const userName = window.sessionStorage.getItem("userName");
        const res = await superagent.post(
          `${process.env.REACT_APP_BACKEND_SERVER_URL}/save-game`,
          {
            userName,
            isWinner,
          }
        );
        if (res.body.message) {
          console.log("Data Saved sucessfully.");
          getLeaderBoardResults();
        }
      } catch (err) {
        console.error(err);
      }
    })();
  };

  const renderCardDeck = () => {
    const highlightedAction = highlight.action || "";
    switch (highlightedAction) {
      case "MATCH_WIN":
        return (
          <>
            <GameSummary label={highlight.message} startGame={resetGame} />
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          </>
        );
      case "EXPLODE":
        return <GameSummary label={highlight.message} startGame={resetGame} />;

      default:
        return (
          <>
            {deck.map((card, i) => (
              <div key={i}>
                <Card card={card} index={i} drawCard={drawCard} />
              </div>
            ))}
            <DeckDetails deckLength={deck.length} />
          </>
        );
    }
  };

  return (
    <div className="App">
      {gameStart ? (
        <>
          <div className="card-wrap-container">{renderCardDeck()}</div>
          <LeaderBoard
            data={leaderBoard}
            getLeaderBoardDetails={getLeaderBoardResults}
          />
          <div className="highlight">
            <p>{highlight.message || ""}</p>
          </div>
        </>
      ) : (
        <LoginForm handleStartGame={handleStartGame} />
      )}
    </div>
  );
}

export default App;
