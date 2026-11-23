import { tx } from '../../i18n';
import type { GameDefinition } from '../types';
import Vierer from './Vierer';

const vierer: GameDefinition = {
  id: 'vierer',
  name: tx('4er'),
  emoji: '🃏',
  tagline: tx('Four players, four rounds, and every point is bad.'),
  color: 'var(--c-blue)',
  categories: ['cards'],
  minPlayers: 4,
  maxPlayers: 4,
  minutes: [30, 45],
  table: 'full',
  explains: true,
  rules: [
    tx('Four players, each on their own phone. All 52 cards are dealt; 2 is low, Ace high. Points are bad: the fewest win.'),
    tx('Three rounds of tricks, each played once. The player left of the dealer picks which of the rounds left is next and leads.'),
    tx('Follow the suit led if you can. The highest card of that suit takes the trick and leads the next one.'),
    tx('Queens: 20 points for every Queen in your tricks. King: 50 for the King of clubs. Tricks: 5 for every trick.'),
    tx('After a round, whoever picked it deals; the player to their left picks next.'),
    tx('Last, the Jacks round: each suit is a line that starts with its Jack, then goes one step down or up at a time. Play a card that fits if you have one; with none, you sit out. After an Ace you play once more.'),
    tx('The first player out of cards gets −50, the second −20. Then the game is over.'),
  ],
  online: Vierer,
};

export default vierer;
