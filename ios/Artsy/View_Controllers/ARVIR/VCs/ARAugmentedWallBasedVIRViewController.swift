import UIKit
import ARKit

class ARAugmentedWallBasedVIRViewController: UIViewController, ARSCNViewDelegate, ARSessionDelegate {

    var config : ARAugmentedRealityConfig!
    var sceneView : ARSCNView!
    var informationView : ARInformationView?
    var informationViewBottomConstraint : NSLayoutConstraint?

    var cursor = FocusSquare()

    @objc func initWithConfig(_ config: ARAugmentedRealityConfig) {
        self.config = config
        self.sceneView = ARSCNView()
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        guard let view = self.view else {
            return
        }

        self.view.backgroundColor = UIColor.black
        self.sceneView.backgroundColor = UIColor.black
        self.view.addSubview(self.sceneView)
        self.sceneView.align(toView: view)

        let scene = SCNScene()

        if (self.config.debugMode) {
            self.sceneView.debugOptions = [.showWorldOrigin, .showFeaturePoints]
            self.sceneView.showsStatistics = true
        }

        let config = ARWorldTrackingConfiguration()
        config
            .planeDetection = .vertical
        self.sceneView.delegate = self
        self.sceneView.scene = scene
        self.sceneView.session.delegate = self
        self.sceneView.session.run(config)

        // Set up scene content.
        self.sceneView.scene.rootNode.addChildNode(cursor)

        setupUI()
    }

    override func viewDidAppear(_ animated: Bool) {
        // TODO: analytics
        super.viewDidAppear(animated)

        // Prevent the screen from being dimmed to avoid interuppting the AR experience.
        UIApplication.shared.isIdleTimerDisabled = true
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        // Allow screen to be dimmed again
        UIApplication.shared.isIdleTimerDisabled = false
        sceneView.session.pause()
    }


    @objc func placeArtwork() {
        print("Here is where I should place the artwork")
    }

    @objc func dismissInformationalViewAnimated() {
        self.dismissInformationalView(animated: true)
    }

    private func dismissInformationalView(animated: Bool) {
        guard let informationView = self.informationView else {
            return
        }

        UIView.animateIf(animated, duration: ARAnimationQuickDuration, options: .curveEaseOut) {
            self.informationViewBottomConstraint?.constant = 40
            informationView.alpha = 0
            // TODO:
            // self.resetButton.alpha = 1
            informationView.setNeedsUpdateConstraints()
            informationView.layoutIfNeeded()
        }
    }



    func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {

    }

    // MARK: Noise

    func setupUI() {
        let backButton = setupBackButton()
        self.view.addSubview(backButton)

        let backButtonConstraints = self.backButtonConstraints(backButton: backButton)
        self.view.addConstraints(backButtonConstraints)

        let informationView = ARInformationView()
        let informationViewStates = self.viewStates(forInformationView: informationView)
        informationView.setup(with: informationViewStates)
        informationView.alpha = 0
        self.view.addSubview(informationView)
        informationView.alignLeading("0", trailing: "0", toView: view)
        informationView.constrainHeight("221")
        self.informationViewBottomConstraint = informationView.alignBottomEdge(withView: view, predicate: "0")
        self.informationViewBottomConstraint?.constant = 40
        self.informationView = informationView
    }

    private func presentInformationalInterface(animated: Bool) {
        guard let informationView = self.informationView else {
            return
        }

        if informationView.alpha > 0 {
            return
        }

        UIView.animateIf(animated, duration: ARAnimationDuration, options: .curveEaseOut) {
            self.informationViewBottomConstraint?.constant = 0
            informationView.alpha = 1
            // TODO:
            // self.resetButton.alpha = 0
            informationView.setNeedsUpdateConstraints()
            self.view.layoutIfNeeded()
            informationView.layoutIfNeeded()
        }
    }

    @objc func exitARContext() {
        // TODO: do I need the time tracking or idle timer thing

        // Ensure we jump past the SetupVC
        var presentingVC : UIViewController? = nil
        if let initialPresentingVC = self.presentingViewController {
            presentingVC = initialPresentingVC
            if (initialPresentingVC.isKind(of: ARAugmentedVIRSetupViewController.self)) {
                presentingVC = initialPresentingVC.presentingViewController
            }
        }

        presentingVC?.dismiss(animated: true)
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

    private func viewStates(forInformationView: ARInformationView) -> [InformationalViewState] {
        let positionArtworkViewState = InformationalViewState()
        positionArtworkViewState.xOutOfYMessage = " "
        positionArtworkViewState.bodyString = "Position the work on the wall and tap to place."
        let placeArtworkButton = ARWhiteFlatButton()
        placeArtworkButton.setTitle("Place Work", for: .normal)
        placeArtworkButton.constrainHeight("50")
        placeArtworkButton.addTarget(self, action: #selector(placeArtwork), for: .touchUpInside)
        positionArtworkViewState.contents = placeArtworkButton

        let congratsArtworkViewState = InformationalViewState()
        congratsArtworkViewState.xOutOfYMessage = " "
        congratsArtworkViewState.bodyString = "The work has been placed. Walk around the work to view it in your space."

        let doneArtworkButton = ARClearFlatButton()
        doneArtworkButton.setTitle("Done", for: .normal)
        doneArtworkButton.constrainHeight("50")
        doneArtworkButton.addTarget(self, action: #selector(dismissInformationalViewAnimated), for: .touchUpInside)
        congratsArtworkViewState.contents = doneArtworkButton

        return [positionArtworkViewState, congratsArtworkViewState]
    }
}
