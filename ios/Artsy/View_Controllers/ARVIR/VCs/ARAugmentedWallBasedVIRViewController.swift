import UIKit
import ARKit

class ARAugmentedWallBasedVIRViewController: UIViewController {

    var config : ARAugmentedRealityConfig!
    var sceneView : ARSCNView!
    var informationView : ARInformationView?
    var informationViewBottomConstraint : NSLayoutConstraint?
    var resetButton : UIButton?
    var messageLabel: UILabel!

    var cursor = FocusSquare()

    let coachingOverlay = ARCoachingOverlayView()

    var artwork : VirtualArtwork?

    // user is on final step, viewing artwork in their space
    var viewingArtwork : Bool = false

    /// A serial queue used to coordinate adding or removing nodes from the scene.
    let updateQueue = DispatchQueue(label: "net.artsy.artsy.verticalVIR.serialSceneKitQueue")

    var dateOpenedAR : Date?

    @objc func initWithConfig(_ config: ARAugmentedRealityConfig) {
        self.config = config
        self.sceneView = ARSCNView()
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        dateOpenedAR = Date()

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
            .planeDetection = [.vertical, .horizontal]
        self.sceneView.delegate = self
        self.sceneView.scene = scene
        self.sceneView.session.delegate = self
        self.sceneView.session.run(config)

        self.sceneView.scene.rootNode.addChildNode(cursor)

        setupCoachingOverlay()

        self.artwork?.removeFromParentNode()
        self.artwork = nil

        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(placeArtwork))
        sceneView.addGestureRecognizer(tapGesture)

        setupUI()
        setupMessageLabel()
    }

    override func viewDidAppear(_ animated: Bool) {
        AREmission.sharedInstance() .sendScreenEvent("AR View in Room Instant", traits: [:])

        super.viewDidAppear(animated)

        // Prevent the screen from being dimmed to avoid interuppting the AR experience.
        UIApplication.shared.isIdleTimerDisabled = true

        presentInformationalInterface(animated: true)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        // Allow screen to be dimmed again
        UIApplication.shared.isIdleTimerDisabled = false
        sceneView.session.pause()
    }


    @objc func placeArtwork() {
        if (viewingArtwork) {
            // Don't allow moving in the final step
            return
        }

        let eventDict = [
            "action_name": "arInstantPlacedArtwork",
            "owner_type" : "artwork",
            "owner_id" : self.config.artworkID,
            "owner_slug": self.config.artworkSlug
        ]
        AREmission.sharedInstance().sendEvent("success", traits: eventDict)

        self.artwork?.removeFromParentNode()
        self.artwork?.stopTrackedRaycast()
        self.artwork = nil

        let artwork = VirtualArtwork(config: config)

        DispatchQueue.main.async {
            let success = self.placeVirtualArtwork(artwork)
            if success {
                self.artwork = artwork

                if  let informationView = self.informationView, informationView.currentState().stateTag == "positionArtwork"
                {
                    self.informationView?.next()
                }
            }
        }
    }

    func placeVirtualArtwork(_ artwork: VirtualArtwork) -> Bool {
        if
            let query = self.sceneView.getRaycastQuery(for: .vertical),
            let result = sceneView.castRay(for: query).first
        {
            artwork.mostRecentInitialPlacementResult = result
            artwork.raycastQuery = query
        } else {
            artwork.mostRecentInitialPlacementResult = nil
            artwork.raycastQuery = nil
        }

        guard cursor.state != .initializing, let query = artwork.raycastQuery else {
            if cursor.state == .initializing {
                showMessage("Waiting to find a surface")
            } else if artwork.raycastQuery == nil {
                showMessage("Please point to a vertical surface")
            }
            return false
        }

        let trackedRaycast = createTrackedRaycastAndSet3DPosition(of: artwork, from: query, withInitialResult: artwork.mostRecentInitialPlacementResult)

        artwork.raycast = trackedRaycast
        artwork.isHidden = false
        return true
    }

    func createTrackedRaycastAndSet3DPosition(of artwork: VirtualArtwork, from query: ARRaycastQuery, withInitialResult initialResult: ARRaycastResult? = nil) -> ARTrackedRaycast? {
        if let initialResult = initialResult {
            artwork.simdWorldTransform = initialResult.worldTransform
        }

        return self.sceneView.session.trackedRaycast(query) { (results) in
            self.setVirtualArtwork3DPosition(results, with: artwork)
        }
    }

    private func setVirtualArtwork3DPosition(_ results: [ARRaycastResult], with artwork: VirtualArtwork) {

        guard let result = results.first else {
            fatalError("Unexpected case: the update handler is always supposed to return at least one result.")
        }

        artwork.simdWorldTransform = result.worldTransform

        // If the virtual object is not yet in the scene, add it.
        if artwork.parent == nil {
            self.sceneView.scene.rootNode.addChildNode(artwork)
        }
    }

    @objc func dismissInformationalViewAnimated() {
        viewingArtwork = true
        self.dismissInformationalView(animated: true)
    }

    private func dismissInformationalView(animated: Bool) {
        guard let informationView = self.informationView else {
            return
        }

        UIView.animateIf(animated, duration: ARAnimationQuickDuration, options: .curveEaseOut) {
            self.informationViewBottomConstraint?.constant = 40
            informationView.alpha = 0
            self.resetButton?.alpha = 1
            informationView.setNeedsUpdateConstraints()
            informationView.layoutIfNeeded()
        }
    }

    // MARK: Cursor

    func updateCursor() {
        if coachingOverlay.isActive || viewingArtwork {
           cursor.hide()
        } else {
            cursor.unhide()
        }

        // Perform ray casting only when ARKit tracking is in a good state.
        if let camera = sceneView.session.currentFrame?.camera, case .normal = camera.trackingState,
            let query = sceneView.getRaycastQuery(),
            let result = sceneView.castRay(for: query).first {

            updateQueue.async {
                self.sceneView.scene.rootNode.addChildNode(self.cursor)
                self.cursor.state = .detecting(raycastResult: result, camera: camera)
            }
        } else {
            updateQueue.async {
                self.cursor.state = .initializing
                self.sceneView.pointOfView?.addChildNode(self.cursor)
            }
        }
    }

    // MARK: Noise

    func setupUI() {
        guard let view = self.view else {
            return
        }

        self.viewingArtwork = false

        let backButton = setupBackButton()
        view.addSubview(backButton)

        let backButtonConstraints = self.backButtonConstraints(backButton: backButton)
        view.addConstraints(backButtonConstraints)

        let resetButton = setupResetButton()
        resetButton.alpha = 0
        view.addSubview(resetButton)
        self.resetButton = resetButton

        let resetButtonConstraints = self.resetButtonConstraints(resetButton: resetButton)
        view.addConstraints(resetButtonConstraints)

        let informationView = ARInformationView()
        let informationViewStates = self.viewStates(forInformationView: informationView)
        informationView.setup(with: informationViewStates)
        informationView.alpha = 0
        view.addSubview(informationView)
        informationView.alignLeading("0", trailing: "0", toView: view)
        informationView.constrainHeight("221")
        self.informationViewBottomConstraint = informationView.alignBottomEdge(withView: view, predicate: "0")
        self.informationViewBottomConstraint?.constant = 40
        self.informationView = informationView
    }

    func setupMessageLabel() {
        self.messageLabel = UILabel()

        let padding : CGFloat = 20
        let height : CGFloat  = 50
        let yStart : CGFloat = (view.bounds.height / 2) - (height / 2)
        self.messageLabel.font = UIFont.displayMediumSansSerifFont(withSize: 14)
        self.messageLabel.frame = CGRect(x: padding, y: yStart, width: view.bounds.width - (padding * 2), height: height)
        self.messageLabel.backgroundColor = UIColor.black.withAlphaComponent(0.7)
        self.messageLabel.textColor = .white
        self.messageLabel.textAlignment = .center
        self.messageLabel.layer.cornerRadius = 10
        self.messageLabel.clipsToBounds = true
        self.messageLabel.alpha = 0
        view.addSubview(messageLabel)
    }

    func showMessage(_ message: String) {
        messageLabel.text = message
        UIView.animate(withDuration: 0.5, animations: {
            self.messageLabel.alpha = 1
        }) { _ in
            UIView.animate(withDuration: 0.5, delay: 2.5, options: [], animations: {
                self.messageLabel.alpha = 0
            }, completion: nil)
        }
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
            self.resetButton?.alpha = 0
            informationView.setNeedsUpdateConstraints()
            self.view.layoutIfNeeded()
            informationView.layoutIfNeeded()
        }
    }

    @objc func resetExperience() {
        self.artwork?.removeFromParentNode()
        self.artwork?.stopTrackedRaycast()
        self.artwork = nil

        self.informationView?.reset()

        self.resetButton?.alpha = 0

        self.viewingArtwork = false

        self.presentInformationalInterface(animated: true)
    }

    func timeInAR() -> TimeInterval? {
        guard let dateOpenedAR = self.dateOpenedAR else {
            return nil
        }

        return dateOpenedAR.timeIntervalSinceNow * -1
    }

    @objc func exit() {
        AREmission.sharedInstance().sendEvent("ar_view_in_room_instant_time", traits: [
            "length" : self.timeInAR() ?? "unknown"
        ])

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
        backButton.addTarget(self, action: #selector(exit), for: .touchUpInside)
        backButton.imageEdgeInsets = UIEdgeInsets(top: -10, left: -10, bottom: -10, right: -10)

        backButton.layer.masksToBounds = false
        backButton.layer.shadowColor = UIColor.black.cgColor
        backButton.layer.shadowOffset = CGSize(width: 0, height: 0)
        backButton.layer.shadowOpacity = 0.4
        return backButton
    }

    private func setupResetButton() -> UIButton {
        let resetButton = ARClearFlatButton()
        resetButton.setTitle("Reset", for: .normal)
        resetButton.translatesAutoresizingMaskIntoConstraints = false
        resetButton.addTarget(self, action: #selector(resetExperience), for: .touchUpInside)
        return resetButton
    }

    private func resetButtonConstraints(resetButton: UIButton) -> [NSLayoutConstraint] {
        let centerXConstraint = resetButton.centerXAnchor.constraint(equalTo: self.view.centerXAnchor, constant: 0)
        let bottomConstraint = resetButton.bottomAnchor.constraint(equalTo: self.view.bottomAnchor, constant: -60)
        let widthConstraint = resetButton.widthAnchor.constraint(equalToConstant: 92)
        return [centerXConstraint, bottomConstraint, widthConstraint]
    }

    private func viewStates(forInformationView: ARInformationView) -> [InformationalViewState] {
        let positionArtworkViewState = InformationalViewState()
        positionArtworkViewState.xOutOfYMessage = " "
        positionArtworkViewState.stateTag = "positionArtwork"
        positionArtworkViewState.bodyString = "Position the work on the wall and tap to place."
        let placeArtworkButton = ARWhiteFlatButton()
        placeArtworkButton.setTitle("Place Work", for: .normal)
        placeArtworkButton.constrainHeight("50")
        placeArtworkButton.addTarget(self, action: #selector(placeArtwork), for: .touchUpInside)
        positionArtworkViewState.contents = placeArtworkButton

        let congratsArtworkViewState = InformationalViewState()
        congratsArtworkViewState.xOutOfYMessage = " "
        congratsArtworkViewState.stateTag = "placedArtwork"
        congratsArtworkViewState.bodyString = "The work has been placed. Tap anywhere to move it."

        let doneArtworkButton = ARClearFlatButton()
        doneArtworkButton.setTitle("Done", for: .normal)
        doneArtworkButton.constrainHeight("50")
        doneArtworkButton.addTarget(self, action: #selector(dismissInformationalViewAnimated), for: .touchUpInside)
        congratsArtworkViewState.contents = doneArtworkButton

        return [positionArtworkViewState, congratsArtworkViewState]
    }
}


/// - Tag: CoachingOverlayViewDelegate
extension ARAugmentedWallBasedVIRViewController: ARCoachingOverlayViewDelegate {

    /// - Tag: HideUI
    func coachingOverlayViewWillActivate(_ coachingOverlayView: ARCoachingOverlayView) {
        self.resetButton?.isHidden = true
        self.informationView?.isHidden = true
    }

    /// - Tag: PresentUI
    func coachingOverlayViewDidDeactivate(_ coachingOverlayView: ARCoachingOverlayView) {
        self.resetButton?.isHidden = false
        self.informationView?.isHidden = false
    }

    /// - Tag: StartOver
    func coachingOverlayViewDidRequestSessionReset(_ coachingOverlayView: ARCoachingOverlayView) {
        resetExperience()
    }

    func setupCoachingOverlay() {
        // Set up coaching view
        coachingOverlay.session = sceneView.session
        coachingOverlay.delegate = self

        coachingOverlay.translatesAutoresizingMaskIntoConstraints = false
        sceneView.addSubview(coachingOverlay)

        NSLayoutConstraint.activate([
            coachingOverlay.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            coachingOverlay.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            coachingOverlay.widthAnchor.constraint(equalTo: view.widthAnchor),
            coachingOverlay.heightAnchor.constraint(equalTo: view.heightAnchor)
        ])

        setActivatesAutomatically()

        // Most of the virtual objects in this sample require a horizontal surface,
        // therefore coach the user to find a horizontal plane.
        setGoal()
    }

    /// - Tag: CoachingActivatesAutomatically
    func setActivatesAutomatically() {
        coachingOverlay.activatesAutomatically = true
    }

    /// - Tag: CoachingGoal
    func setGoal() {
        coachingOverlay.goal = .verticalPlane
    }
}


extension ARAugmentedWallBasedVIRViewController: ARSCNViewDelegate, ARSessionDelegate {
    func renderer(_ renderer: SCNSceneRenderer, updateAtTime time: TimeInterval) {
        DispatchQueue.main.async {
            self.updateCursor()
        }
    }
}
