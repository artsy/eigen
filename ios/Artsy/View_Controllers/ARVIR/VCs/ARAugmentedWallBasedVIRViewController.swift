import UIKit
import ARKit

class ARAugmentedWallBasedVIRViewController: UIViewController, ARSCNViewDelegate, ARSessionDelegate {

    var config : ARAugmentedRealityConfig!
    var sceneView : ARSCNView!
    var informationView : ARInformationView?
    var informationViewBottomConstraint : NSLayoutConstraint?

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

        // TODO: Should I still do the idle timer thing?
    }

    override func viewDidAppear(_ animated: Bool) {
        // TODO: analytics
        super.viewDidAppear(animated)

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.presentInformationalInterface(animated: true)
        }
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        sceneView.session.pause()
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

        let pointAtWallViewState = InformationalViewState()
        pointAtWallViewState.xOutOfYMessage = "Step 1 of 2"
        pointAtWallViewState.bodyString = "Point your device at a wall nearby."
        let spinner = ARSpinner()
        spinner.spinnerColor = UIColor.white
        spinner.constrainHeight("40")
        pointAtWallViewState.contents = spinner
        pointAtWallViewState.onStart = { (customView: UIView) in
            spinner.startAnimating()
        }

        let positionArtworkViewState = InformationalViewState()
        positionArtworkViewState.xOutOfYMessage = "Step 2 of 2"
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

        return [pointAtWallViewState, positionArtworkViewState, congratsArtworkViewState]
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

    func renderer(_ renderer: SCNSceneRenderer, didAdd node: SCNNode, for anchor: ARAnchor) {
        guard let planeAnchor = anchor as? ARPlaneAnchor, planeAnchor.alignment == .vertical else { return }

        let planeNode = createPlaneNode(for: planeAnchor)
        node.addChildNode(planeNode)
    }

    func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
        guard let planeAnchor = anchor as? ARPlaneAnchor, planeAnchor.alignment == .vertical else { return }

        if let planeNode = node.childNodes.first, let plane = planeNode.geometry as? SCNPlane {
            updatePlaneNode(planeNode, with: plane, for: planeAnchor)
        }
    }

    func createPlaneNode(for planeAnchor: ARPlaneAnchor) -> SCNNode {
        let plane = SCNPlane(width: CGFloat(planeAnchor.extent.x), height: CGFloat(planeAnchor.extent.z))
        plane.firstMaterial?.diffuse.contents = UIColor.blue.withAlphaComponent(0.5)

        let planeNode = SCNNode(geometry: plane)
        planeNode.position = SCNVector3(planeAnchor.center.x, 0, planeAnchor.center.z)
        planeNode.eulerAngles.x = -.pi / 2

        return planeNode
    }

    func updatePlaneNode(_ planeNode: SCNNode, with plane: SCNPlane, for planeAnchor: ARPlaneAnchor) {
        plane.width = CGFloat(planeAnchor.extent.x)
        plane.height = CGFloat(planeAnchor.extent.z)

        planeNode.position = SCNVector3(planeAnchor.center.x, 0, planeAnchor.center.z)
    }
}
