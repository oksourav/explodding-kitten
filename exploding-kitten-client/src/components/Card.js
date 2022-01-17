function Card({ card, index, drawCard }) {
  return (
    <div className="card-wrap" key={index} onClick={() => drawCard(index)}>
      <div className="card">
        <div className="card-info">
          <div className="header">
            {card.isDrawn ? (
              <>
                <h1>{card.emoji}</h1>
                <p>{card.name}</p>
              </>
            ) : (
              <>
                <h1>🐱</h1>
                <p>Click on the card to Draw</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
