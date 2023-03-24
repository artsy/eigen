import UIKit
import ARKit

class ARAugmentedWallBasedVIRViewController: UIViewController {

    var config : ARAugmentedRealityConfig!
    var sceneView : ARSCNView!

    @objc func initWithConfig(_ config: ARAugmentedRealityConfig) {
        self.config = config
        self.sceneView = ARSCNView()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor = UIColor.black
        self.sceneView.backgroundColor = UIColor.black
        self.view.addSubview(self.sceneView)
        self.sceneView.align(toView: self.view!)
        print("Got config with artwork \(config.artworkSlug)")
    }
}
