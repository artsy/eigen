import { TrackingProvider } from "."

export const SegmentTrackingProvider: TrackingProvider = {
  // tslint:disable-next-line:no-empty
  identify: (_, __) => {},
  // tslint:disable-next-line:no-empty
  postEvent: (_) => {},
}
