// Metaphysics formats a stop's clock time with moment's `h:mma`, which always
// prints minutes (e.g. "8:00pm"). The design drops a zero minute ("8pm"),
// so this trims it back off.
export const formatStopClockTime = (time: string): string => time.replace(/:00(?=[ap]m$)/, "")
