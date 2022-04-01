import UIKit
import ARKit
import RealityKit

class ARSculptureVIRViewController: UIViewController {

    var arView : ARView?

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        if (arView == nil) {
            let arView = createARView()
            self.view.addSubview(arView)
            self.arView = arView
        }
    }

    func createARView() -> ARView {
        let arView = ARView()
        arView.frame = self.view.frame
        return arView
    }

}
