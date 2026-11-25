// The patience games for one: Beat the Deck, Accordion.
const solitaire: Record<string, string> = {
  'Solved': 'Gelöst',
  // Accordion
  Accordion: 'Akkordeon',
  'Squeeze a line of 52 cards down to one pile.': 'Schieb eine Reihe aus 52 Karten zu einem einzigen Stapel zusammen.',
  'Deal the cards one at a time into a line of piles, left to right.': 'Leg die Karten einzeln in eine Reihe von Stapeln, von links nach rechts.',
  'A pile may go on the pile right before it, or three before it, if their top cards match in rank or suit. The whole pile moves.':
    'Ein Stapel darf auf den direkt davor oder auf den drei davor, wenn die obersten Karten im Wert oder in der Farbe passen. Der ganze Stapel zieht mit.',
  'After a move, look again: the line got shorter and new matches can turn up. The order you choose matters.':
    'Nach jedem Zug neu schauen: Die Reihe ist kürzer und neue Paare können entstehen. Die Reihenfolge zählt.',
  'Deal the whole deck. One pile left is a win, and it’s rare: the fewer piles, the better.':
    'Leg das ganze Deck aus. Ein einziger Stapel ist ein Sieg, und der ist selten: Je weniger Stapel, desto besser.',
  'One pile left: solved': 'Nur noch ein Stapel: gelöst',
  '{n} piles left': '{n} Stapel übrig',
  'Your best: {n} piles': 'Dein Bestes: {n} Stapel',
  'Onto which pile?': 'Auf welchen Stapel?',
  'Tap a pile to move it': 'Tipp einen Stapel, um ihn zu verschieben',
  'Deal the next card': 'Leg die nächste Karte',
  Deal: 'Legen',
  // Beat the Deck
  'Beat the Deck': 'Schlag das Deck',
  'Higher or lower on nine cards, through the whole deck.': 'Höher oder tiefer auf neun Karten, durch das ganze Deck.',
  'Nine cards lie face up. The rest of the deck is the pile.': 'Neun Karten liegen offen. Der Rest des Decks ist der Stapel.',
  'Pick one of the nine and say whether the next card from the pile is higher or lower.': 'Wähl eine der neun und sag, ob die nächste Karte vom Stapel höher oder tiefer ist.',
  'Right: the new card goes on top of it. Wrong, or the same rank: that place is turned over and out.':
    'Richtig: Die neue Karte kommt obendrauf. Falsch oder gleicher Wert: Der Platz wird umgedreht und ist raus.',
  'Get through the whole pile with at least one place left and you beat the deck. Aces are high.':
    'Schaffst du den ganzen Stapel mit mindestens einem Platz übrig, hast du das Deck geschlagen. Asse sind hoch.',
  'You beat the deck': 'Du hast das Deck geschlagen',
  'The deck wins': 'Das Deck gewinnt',
  '{n} of 9 places still open.': '{n} von 9 Plätzen noch offen.',
  '{n} cards were left in the pile.': '{n} Karten waren noch im Stapel.',
  'Higher or lower than {rank}?': 'Höher oder tiefer als {rank}?',
  'The cards are shuffled and dealt again.': 'Die Karten werden neu gemischt und ausgelegt.',
};

export default solitaire;
