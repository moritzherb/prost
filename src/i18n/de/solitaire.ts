// The patience games for one: Beat the Deck, Clock Patience, Accordion.
const solitaire: Record<string, string> = {
  'Solved!': 'Gelöst!',
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
  'One pile left: solved!': 'Nur noch ein Stapel: gelöst!',
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
  'You beat the deck!': 'Du hast das Deck geschlagen!',
  'The deck wins': 'Das Deck gewinnt',
  '{n} of 9 places still open.': '{n} von 9 Plätzen noch offen.',
  '{n} cards were left in the pile.': '{n} Karten waren noch im Stapel.',
  'Higher or lower than {rank}?': 'Höher oder tiefer als {rank}?',
  // Clock Patience
  'Clock Patience': 'Uhren-Patience',
  'Thirteen piles round a clock. Get every card out before the fourth King.': 'Dreizehn Stapel rund um eine Uhr. Bring alle Karten raus vor dem vierten König.',
  'Thirteen piles of four lie face down: twelve round a clock, one in the middle.': 'Dreizehn Stapel zu je vier liegen verdeckt: zwölf rund um eine Uhr, einer in der Mitte.',
  'Turn the middle’s top card and lay it by its hour: Ace at one, Jack at eleven, Queen at twelve, Kings in the middle.':
    'Dreh die oberste Karte der Mitte um und leg sie zu ihrer Stunde: Ass auf eins, Bube auf elf, Dame auf zwölf, Könige in die Mitte.',
  'Then turn the top card of that pile, and so on.': 'Dann dreh die oberste Karte dieses Stapels um, und so weiter.',
  'Every card out before the fourth King turns up: you win. The fourth King too soon: you lose. It’s all luck.':
    'Alle Karten draußen, bevor der vierte König kommt: gewonnen. Der vierte König zu früh: verloren. Reines Glück.',
  'Every card is out!': 'Alle Karten sind draußen!',
  'The fourth King came too soon': 'Der vierte König kam zu früh',
  '{n} of 52 cards laid.': '{n} von 52 Karten gelegt.',
  'Turn the next card': 'Dreh die nächste Karte um',
  'Turn the first card from the middle': 'Dreh die erste Karte der Mitte um',
  'Goes to {hour}': 'Kommt zu {hour}',
  'the middle': 'der Mitte',
  'Lay it down': 'Hinlegen',
  'Turn a card': 'Karte umdrehen',
};

export default solitaire;
