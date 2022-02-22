import { postEventToProviders } from "app/utils/track/providers"
import track from "react-tracking"

/**
 * wrap components with this to inject react-tracking
 * make sure to call
 *   jest.unmock('react-tracking')
 * and mock out Events
 *   jest.mock("app/NativeModules/Events", () => ({ postEvent: jest.fn() }))
 * and then import Events
 *   import Events from "app/NativeModules/Events"
 * and then make assertions like
 *   expect(Events.postEvent).toHaveBeenCalledWith({myTrackingProperty: "whateve"})
 */
export function mockTracking<Props>(
  Component: React.ComponentType<Props>
): React.ComponentType<Props> {
  return track({}, { dispatch: (data) => postEventToProviders(data) })(Component)
}
