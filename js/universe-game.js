import { initPlaceholderUniverse } from './universe-content.js';
import { t } from './i18n.js';

export function initGameEarth(container) {
  initPlaceholderUniverse(container, t('game.title'), t('game.comingSoon'));
}
