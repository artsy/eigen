import Foundation
import SceneKit
import ARKit

class VirtualArtwork: SCNNode {

    init(config: ARAugmentedRealityConfig) {
        super.init()
        self.geometry = VirtualArtwork.box(withConfig: config)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

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

    static func box(withConfig config: ARAugmentedRealityConfig) -> SCNBox {

        let widthMeters = convertInchesToMeters(config.size.width)

        let heightMeters = convertInchesToMeters(config.size.height)

        let lengthMeters = convertInchesToMeters(config.depth)

        // Sides / Back
        let blackMaterial = coloredMaterial(withColor: .black)

        // Front
        let imageMaterial = SCNMaterial()
        imageMaterial.diffuse.contents = config.image
        imageMaterial.locksAmbientWithDiffuse = true
        imageMaterial.lightingModel = .physicallyBased
        /**
         A bit confusing but SCNBox assumes an orientation similar to a box on the ground and for our placement code we want an orientation similar to an artwork placed on a wall, therefore we switch length and height
         **/
        let box = SCNBox(width: widthMeters, height: lengthMeters, length: heightMeters, chamferRadius: 0.0);
        box.materials =  [blackMaterial, blackMaterial, blackMaterial, blackMaterial, imageMaterial, blackMaterial]
        box.name = "Artwork"
        return box
    }

    static func coloredMaterial(withColor color: UIColor) -> SCNMaterial {
        let material = SCNMaterial()
        material.diffuse.contents = color
        material.locksAmbientWithDiffuse = true
        return material
    }

    static func convertInchesToMeters(_ value: Double) -> CGFloat {
        let valueInches = NSMeasurement(doubleValue: value, unit: UnitLength.inches)
        let valueMeters : CGFloat = valueInches.converting(to: UnitLength.meters).value
        return valueMeters
    }
}
