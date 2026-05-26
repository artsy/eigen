import { IANATimezone } from "app/utils/IANATimezone"

// Does not work with Luxon, use Settings.defaultZoneName instead
export const mockTimezone = (timezone: IANATimezone) => {
  const mutatedResolvedOptions = Intl.DateTimeFormat().resolvedOptions()
  const mutatedDateTimeFormat = Intl.DateTimeFormat()

  mutatedResolvedOptions.timeZone = timezone
  mutatedDateTimeFormat.resolvedOptions = () => mutatedResolvedOptions
  Intl.DateTimeFormat = (() => mutatedDateTimeFormat) as any
}
