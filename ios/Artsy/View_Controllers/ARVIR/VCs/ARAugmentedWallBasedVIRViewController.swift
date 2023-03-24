import UIKit
import ARKit

class ARAugmentedWallBasedVIRViewController: UIViewController, ARSCNViewDelegate, ARSessionDelegate {

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

        let scene = SCNScene()

        if (self.config.debugMode) {
            self.sceneView.debugOptions = [.showWorldOrigin, .showFeaturePoints]
            self.sceneView.showsStatistics = true
        }

        self.sceneView.delegate = self
        self.sceneView.scene = scene
        self.sceneView.session.delegate = self

        let backButton = setupBackButton()
        self.view.addSubview(backButton)

        let backButtonConstraints = self.backButtonConstraints(backButton: backButton)
        self.view.addConstraints(backButtonConstraints)
    }

    private func backButtonConstraints(backButton: UIButton) -> [NSLayoutConstraint] {
        let topConstraint = backButton.topAnchor.constraint(equalTo: self.view.safeAreaLayoutGuide.topAnchor, constant: 10)
        let leftConstraint = backButton.leftAnchor.constraint(equalTo: self.view.leftAnchor, constant: 4)
        let heightConstraint = backButton.heightAnchor.constraint(equalToConstant: 50)
        let widthConstraint = backButton.widthAnchor.constraint(equalToConstant: 50)
        return [topConstraint, leftConstraint, heightConstraint, widthConstraint]
    }

    private func setupBackButton() -> UIButton {
        let backButton = ARClearFlatButton()
        backButton.setBorderColor(.clear, for: .normal)
        backButton.setBorderColor(.clear, for: .highlighted)
        backButton.setBackgroundColor(.clear, for: .highlighted)
        let backImage = UIImage(named: "ARVIRBack")
        backButton.setImage(backImage, for: .normal)
        backButton.translatesAutoresizingMaskIntoConstraints = false
        backButton.addTarget(self, action: #selector(exitARContext), for: .touchUpInside)
        backButton.imageEdgeInsets = UIEdgeInsets(top: -10, left: -10, bottom: -10, right: -10)

        backButton.layer.masksToBounds = false
        backButton.layer.shadowColor = UIColor.black.cgColor
        backButton.layer.shadowOffset = CGSize(width: 0, height: 0)
        backButton.layer.shadowOpacity = 0.4
        return backButton
    }

    @objc func exitARContext() {
        // TODO: do I need the time tracking or idle timer thing

        var presentingVC : UIViewController? = nil
        if let initialPresentingVC = self.presentingViewController {
            presentingVC = initialPresentingVC
            if (initialPresentingVC.isKind(of: ARAugmentedWallBasedVIRViewController.self)) {
                presentingVC = initialPresentingVC.presentingViewController
            }
        }

        presentingVC?.dismiss(animated: true)
    }
}
