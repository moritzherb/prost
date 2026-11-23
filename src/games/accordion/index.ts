import { tx } from '../../i18n';
import type { GameDefinition } from '../types';
import Accordion from './Accordion';

const accordion: GameDefinition = {
  id: 'accordion',
  name: tx('Accordion'),
  emoji: '🪗',
  tagline: tx('Squeeze a line of 52 cards down to one pile.'),
  color: 'var(--c-mint)',
  categories: ['cards', 'quick'],
  minPlayers: 1,
  maxPlayers: 1,
  playersOptional: true,
  table: 'full',
  minutes: [5, 10],
  rules: [
    tx('Deal the cards one at a time into a line of piles, left to right.'),
    tx('A pile may go on the pile right before it, or three before it, if their top cards match in rank or suit. The whole pile moves.'),
    tx('After a move, look again: the line got shorter and new matches can turn up. The order you choose matters.'),
    tx('Deal the whole deck. One pile left is a win, and it’s rare: the fewer piles, the better.'),
  ],
  component: Accordion,
};

export default accordion;
