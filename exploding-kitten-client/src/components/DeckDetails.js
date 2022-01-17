function DeckDetails({ deckLength }) {
  return (
    <div className="cards-left-to-withdraw">
      <div className="label">Cards left to withdraw: </div>
      <div className="value">{deckLength}</div>
    </div>
  );
}

export default DeckDetails;
