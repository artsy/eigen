import { postEventToProviders } from "app/utils/track/providers"
import { TrackingProp } from "react-tracking"

export const mockPostEventToProviders = postEventToProviders as jest.MockedFunction<
  typeof postEventToProviders
>

export const mockTrackEvent = jest.fn() as jest.MockedFunction<TrackingProp["trackEvent"]>
