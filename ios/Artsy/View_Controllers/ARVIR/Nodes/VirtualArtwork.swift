import Foundation
import SceneKit
import ARKit

class VirtualArtwork: SCNArtworkNode {

    /// The raycast query used when placing this object.
    var raycastQuery: ARRaycastQuery?

    /// The associated tracked raycast used to place this object.
    var raycast: ARTrackedRaycast?

    /// The most recent raycast result used for determining the initial location
    /// of the object after placement.
    var mostRecentInitialPlacementResult: ARRaycastResult?


    /// Stops tracking the object's position and orientation.
    func stopTrackedRaycast() {
        raycast?.stopTracking()
        raycast = nil
    }
}
