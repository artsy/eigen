import { TrackingProvider } from "."

export const SegmentTrackingProvider: TrackingProvider = {
  identify: (_, __) => {},
  postEvent: (_) => {},
}
