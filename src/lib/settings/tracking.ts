/**
 * Caminho: src/lib/settings/tracking.ts
 * Arquivo: tracking.ts
 * Descrição: Diz se o site tem algum rastreamento (GTM, GA4 ou Meta Pixel) com código válido. Sem isso o aviso de cookies não precisa aparecer.
 */
import { TRACKING_PATTERNS } from "./schema";

type TrackingFields = { gtmId: string; gaId: string; metaPixelId: string };

export function hasTracking(settings: TrackingFields): boolean {
  return (
    TRACKING_PATTERNS.gtmId.test(settings.gtmId) ||
    TRACKING_PATTERNS.gaId.test(settings.gaId) ||
    TRACKING_PATTERNS.metaPixelId.test(settings.metaPixelId)
  );
}
