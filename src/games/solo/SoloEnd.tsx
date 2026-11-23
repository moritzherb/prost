import BigButton from '../../components/BigButton';
import Finished from '../../components/Finished';
import { t } from '../../i18n';

/** The end of a patience game: how it went, and again or out. */
export default function SoloEnd({ game, won, title, lead, onAgain, exit }: { game: string; won: boolean; title: string; lead?: string; onAgain: () => void; exit: () => void }) {
  return (
    <div className="bd">
      {won && <Finished game={game} />}
      <div className="bd-head center">
        <span className="kicker">{won ? t('Solved!') : t('Game over')}</span>
        <h2 className="bd-title big">{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      <div className="sticky-action stack">
        <BigButton size="xl" onClick={onAgain}>
          {t('Play again')}
        </BigButton>
        <BigButton variant="glass" onClick={exit}>
          {t('Back to games')}
        </BigButton>
      </div>
    </div>
  );
}
