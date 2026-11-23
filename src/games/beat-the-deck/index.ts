import { tx } from '../../i18n';
import type { GameDefinition } from '../types';
import BeatTheDeck from './BeatTheDeck';

const beatTheDeck: GameDefinition = {
  id: 'beat-the-deck',
  name: tx('Beat the Deck'),
  emoji: '🎯',
  tagline: tx('Higher or lower on nine cards, through the whole deck.'),
  color: 'var(--c-orange)',
  categories: ['cards', 'quick'],
  minPlayers: 1,
  maxPlayers: 1,
  playersOptional: true,
  table: 'full',
  minutes: [5, 10],
  rules: [
    tx('Nine cards lie face up. The rest of the deck is the pile.'),
    tx('Pick one of the nine and say whether the next card from the pile is higher or lower.'),
    tx('Right: the new card goes on top of it. Wrong, or the same rank: that place is turned over and out.'),
    tx('Get through the whole pile with at least one place left and you beat the deck. Aces are high.'),
  ],
  component: BeatTheDeck,
};

export default beatTheDeck;
