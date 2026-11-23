import { tx } from '../../i18n';
import type { GameDefinition } from '../types';
import ClockPatience from './ClockPatience';

const clockPatience: GameDefinition = {
  id: 'clock-patience',
  name: tx('Clock Patience'),
  emoji: '🕰️',
  tagline: tx('Thirteen piles round a clock. Get every card out before the fourth King.'),
  color: 'var(--c-lilac)',
  categories: ['cards', 'quick'],
  minPlayers: 1,
  maxPlayers: 1,
  playersOptional: true,
  table: 'full',
  minutes: [3, 6],
  rules: [
    tx('Thirteen piles of four lie face down: twelve round a clock, one in the middle.'),
    tx('Turn the middle’s top card and lay it by its hour: Ace at one, Jack at eleven, Queen at twelve, Kings in the middle.'),
    tx('Then turn the top card of that pile, and so on.'),
    tx('Every card out before the fourth King turns up: you win. The fourth King too soon: you lose. It’s all luck.'),
  ],
  component: ClockPatience,
};

export default clockPatience;
