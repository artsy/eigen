import UIKit
import ARKit
import RealityKit
import FocusEntity

class ARSculptureVIRViewController: UIViewController, ARSessionDelegate {

    weak var arView : ARView?
    var focusEntity: FocusEntity?

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        if (arView == nil) {
            let arView = createARView()
            startARSession(arView: arView)
            self.view.addSubview(arView)
            self.arView = arView
        }
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

}
