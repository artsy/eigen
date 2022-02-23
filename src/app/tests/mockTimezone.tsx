// Does not work with Luxon, use Settings.defaultZoneName instead
export const mockTimezone = (timezone: any /* STRICTNESS_MIGRATION */) => {
  const mutatedResolvedOptions: any = Intl.DateTimeFormat().resolvedOptions()
  const mutatedDateTimeFormat: any = Intl.DateTimeFormat()

  mutatedResolvedOptions.timeZone = timezone
  mutatedDateTimeFormat.resolvedOptions = () => mutatedResolvedOptions
  Intl.DateTimeFormat = (() => mutatedDateTimeFormat) as any
}
