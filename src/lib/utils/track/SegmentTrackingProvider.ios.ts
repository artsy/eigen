import { TrackingProvider } from "."

export const SegmentTrackingProvider: TrackingProvider = {
  identify: (userId, traits) => {},
  postEvent: (info) => {},
}
