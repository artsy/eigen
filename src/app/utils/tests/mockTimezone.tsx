import { IANATimezone } from "app/utils/IANATimezone"
import { Settings } from "luxon"

/**
 * Mocks the timezone for both Luxon and moment-timezone (during migration).
 * After moment is fully removed, only the Luxon Settings.defaultZone will be needed.
 */
export const mockTimezone = (timezone: IANATimezone) => {
  // For Luxon
  Settings.defaultZone = timezone

  // Keep the old approach for any remaining moment code during migration
  const mutatedResolvedOptions = Intl.DateTimeFormat().resolvedOptions()
  const mutatedDateTimeFormat = Intl.DateTimeFormat()

  mutatedResolvedOptions.timeZone = timezone
  mutatedDateTimeFormat.resolvedOptions = () => mutatedResolvedOptions
  Intl.DateTimeFormat = (() => mutatedDateTimeFormat) as any
}
