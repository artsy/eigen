import UIKit
import ARKit
import RealityKit
import FocusEntity

class ARSculptureVIRViewController: UIViewController, ARSessionDelegate {

    weak var arView : ARView?

    var modelName : String!

    var focusEntity : FocusEntity?
    var displayedModel : ModelEntity?
    var previousAnchor : AnchorEntity?

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        if (arView == nil) {
            let arView = createARView()
            startARSession(arView: arView)
            self.view.addSubview(arView)
            self.arView = arView
        }
    }

    @objc public func setModelName(name: String) {
        self.modelName = name
    }

    func createARView() -> ARView {
        let arView = ARView()
        arView.frame = self.view.bounds
        return arView
    }

    func startARSession(arView: ARView) {
        // Start AR session
        let session = arView.session
        let config = ARWorldTrackingConfiguration()
        config.planeDetection = [.horizontal]
        session.run(config)

        // Handle ARSession events via delegate
        session.delegate = self

        // Add coaching overlay
        let coachingOverlay = ARCoachingOverlayView()
        coachingOverlay.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        coachingOverlay.session = session
        coachingOverlay.goal = .horizontalPlane
        coachingOverlay.frame = arView.bounds
        arView.addSubview(coachingOverlay)

        let tapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(ARSculptureVIRViewController.handleTap))
        arView.addGestureRecognizer(tapGestureRecognizer)

        // Set debug options
        #if DEBUG
        arView.debugOptions = [.showFeaturePoints, .showAnchorOrigins, .showAnchorGeometry]
        #endif
    }


    // MARK: ARSessionDelegate

    func session(_ session: ARSession, didAdd anchors: [ARAnchor]) {
         guard let arView = self.arView else { return }
         debugPrint("Anchors added to the scene: ", anchors)
         self.focusEntity = FocusEntity(on: arView, style: .classic(color: .purple))
     }

    // MARK: UserInteractions

    @objc func handleTap() {
        guard let arView = self.arView, let focusEntity = self.focusEntity else { return }

        // remove previous model if it exists
        if
            let displayedModel = self.displayedModel,
            let previousAnchor = self.previousAnchor
        {
            previousAnchor.removeChild(displayedModel)
        }

        // Create a new anchor to add content to
        let anchor = AnchorEntity()
        self.previousAnchor = anchor
        arView.scene.anchors.append(anchor)

        // Add a model entity
        let modelEntity = try! ModelEntity.loadModel(named: modelName)
        modelEntity.scale = [1.0, 1.0, 1.0]
        modelEntity.position = focusEntity.position
        self.displayedModel = modelEntity

        anchor.addChild(modelEntity)
    }
}
