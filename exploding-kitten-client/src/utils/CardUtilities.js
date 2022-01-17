const CARD_LIST = [
  {
    name: "Cat Card",
    emoji: "😼",
    isDrawn: false,
    identity: "CAT",
  },
  {
    name: "Defuse Card",
    emoji: "🙅‍♂️",
    isDrawn: false,
    identity: "DEFUSE",
  },
  {
    name: "Shuffle card",
    emoji: "🔀",
    isDrawn: false,
    identity: "SHUFFLE",
  },
  {
    name: "Exploding kitten card",
    emoji: "💣",
    isDrawn: false,
    identity: "EXPLODDING",
  },
];

function randomize(array) {
  for (let index = array.length - 1; index > 0; index--) {
    const randomNumber = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomNumber]] = [array[randomNumber], array[index]];
  }
  return array;
}

export const GenerateDeckOfCards = () => {
  let cardsList = [];
  [...Array(3)].forEach(() => {
    const shuffledCard = randomize(CARD_LIST);
    cardsList = [...cardsList, ...shuffledCard];
  });
  return randomize(cardsList)
    .filter((_, index) => index < 5)
    .reverse();
};
