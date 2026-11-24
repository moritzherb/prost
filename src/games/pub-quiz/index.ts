import { tx } from '../../i18n';
import type { GameDefinition } from '../types';
import PubQuiz from './PubQuiz';
import PubQuizSolo from './PubQuizSolo';

const pubQuiz: GameDefinition = {
  id: 'pub-quiz',
  name: tx('Pub Quiz'),
  emoji: '🧠',
  tagline: tx('One phone asks, everyone else has a buzzer.'),
  color: 'var(--c-yellow)',
  categories: ['party', 'teams'],
  minPlayers: 1,
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
    tx('Alone? Start it on one phone: it asks, you look at the answer and say honestly if you knew it.'),
  ],
  component: PubQuizSolo,
  online: PubQuiz,
};

export default pubQuiz;
