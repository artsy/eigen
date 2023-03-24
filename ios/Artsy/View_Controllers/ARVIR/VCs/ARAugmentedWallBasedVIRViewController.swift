import UIKit

class ARAugmentedWallBasedVIRViewController: UIViewController {

    @objc var config : ARAugmentedRealityConfig!

    override func viewDidLoad() {
        super.viewDidLoad()
        print("Got config with artwork \(config.artworkSlug)")
        // Do any additional setup after loading the view.
    }
}
