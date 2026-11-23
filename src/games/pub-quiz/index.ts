import { tx } from '../../i18n';
import type { GameDefinition } from '../types';
import PubQuiz from './PubQuiz';

const pubQuiz: GameDefinition = {
  id: 'pub-quiz',
  name: tx('Pub Quiz'),
  emoji: '🧠',
  tagline: tx('One phone asks, everyone else has a buzzer.'),
  color: 'var(--c-yellow)',
  categories: ['party', 'teams'],
  minPlayers: 2,
  minutes: [15, 45],
  table: 'full',
  explains: true,
  phones: tx('One phone to ask, a buzzer for every player or team'),
  rules: [
    tx('The host’s phone is the quizmaster’s: it shows the question, the answer and the scores. Every other phone is a buzzer.'),
    tx('Pick how hard (mix as you like), how many questions, and whether you play alone or in teams with one buzzer each.'),
    tx('The quizmaster reads the question out. Whoever buzzes first answers.'),
    tx('Right: a point and the next question. Wrong: the buzzers open again, but nobody buzzes twice on a question before everyone else has buzzed once.'),
    tx('Nobody knows? The quizmaster moves on. The most points at the end win.'),
  ],
  online: PubQuiz,
};

export default pubQuiz;
