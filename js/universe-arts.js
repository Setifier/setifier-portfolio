import { initPlaceholderUniverse } from './universe-content.js';
import { t } from './i18n.js';

export function initArtsStation(container) {
  initPlaceholderUniverse(container, t('arts.title'), t('arts.comingSoon'));
}
