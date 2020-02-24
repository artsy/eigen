import Event from "lib/NativeModules/Events"
import track from "react-tracking"

/**
 * wrap components with this to inject react-tracking
 * make sure to call
 *   jest.unmock('react-tracking')
 * and mock out Events
 *   jest.mock("lib/NativeModules/Events", () => ({ postEvent: jest.fn() }))
 * and then import Events
 *   import Events from "lib/NativeModules/Events"
 * and then make assertions like
 *   expect(Events.postEvent).toHaveBeenCalledWith({myTrackingProperty: "whateve"})
 */
export function mockTracking<Props>(Component: React.ComponentType<Props>): React.ComponentType<Props> {
  return track({}, { dispatch: data => Event.postEvent(data) })(Component)
}
