import type { CSSProperties } from 'react';
import type { GameDefinition } from '../games/types';
import { t } from '../i18n';
import type { TurnPlayer } from '../lib/turn';
import { useApp } from '../state/AppState';
import Avatar from './Avatar';
import { CleanIcon, HelpIcon, PeopleIcon, UncleanIcon } from './Icons';
import TopBar, { RoundButton } from './TopBar';

/** Whether a game shows with a clean table: always, never, or as the players' switch says. */
export const isClean = (game: GameDefinition, setting: boolean | undefined) => (game.table ? game.table === 'clean' : !!setting);

/**
 * The bar over every game: quit on the left, the game's name, the rules and the clean-table switch.
 * The name looks and sits the same in every game, clean table or not. Who's on (in a game that
 * names them) is a small face beside the quit button, clear of the name. With a clean table the
 * switch back stands where the rules were; a game that's always clean has the rules there; on a
 * setup screen (nothing a clean table would change) there's no switch.
 */
export default function GameBar({
  game,
  turn,
  playing,
  onExit,
  onRules,
  onCrew,
}: {
  game: GameDefinition;
  turn: TurnPlayer | null;
  playing: boolean;
  onExit: () => void;
  onRules: () => void;
  /** The crew, to add someone mid-game (one-phone games; a room has its own). */
  onCrew?: () => void;
}) {
  const { settings, updateSettings } = useApp();
  const clean = isClean(game, settings.clean);
  const switchable = !game.table && playing;
  const rules = (
    <RoundButton label={t('Rules')} onClick={onRules}>
      <HelpIcon />
    </RoundButton>
  );
  const crew = onCrew && (
    <RoundButton label={t('The crew')} onClick={onCrew}>
      <PeopleIcon />
    </RoundButton>
  );
  const toggle = (
    <RoundButton label={clean ? t('Show everything') : t('Clean table')} onClick={() => updateSettings({ clean: !clean })}>
      {clean ? <UncleanIcon /> : <CleanIcon />}
    </RoundButton>
  );
  return (
    <TopBar
      className="game-bar"
      title={t(game.name)}
      left={
        turn && (
          <span key={turn.name} className="turn-chip" style={{ '--chip': turn.color } as CSSProperties} role="status" aria-label={t('{name}’s turn', { name: turn.name })}>
            <Avatar name={turn.name} color={turn.color} photo={turn.photo} />
          </span>
        )
      }
      onBack={onExit}
      icon="close"
      right={
        clean ? (
          <>
            {crew}
            {switchable ? toggle : rules}
          </>
        ) : (
          <>
            {crew}
            {switchable && toggle}
            {rules}
          </>
        )
      }
    />
  );
}
