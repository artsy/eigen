import UIKit
import HockeySDK_Source
import Photos
import ARAnalytics
import ReplayKit

class ARHockeyFeedbackDelegate: NSObject {
    static let shared = ARHockeyFeedbackDelegate()

    func listenForScreenshots() {
        let mainQueue = OperationQueue.main
        let notifications = NotificationCenter.default
        notifications.addObserver(forName: NSNotification.Name.UIApplicationUserDidTakeScreenshot, object: nil, queue: mainQueue) { notification in

            UIView.animate(withDuration: 0.15) {
                ARTopMenuViewController.shared().view.alpha = 0.5
            }

            // When I looked at how Hockey did this, I found that they would delay by a second
            // presumably it can take a second to have the image saved in the asset store before
            // we can pull it out again. We could not get away with 0.5, so 1.0.
            ar_dispatch_after(1.0) {
                self.showFeedbackWithRecentScreenshot()
            }
        }
    }

    func showFeedback(_ image: UIImage? = nil, data: Data? = nil) {
        let hockeyProvider = ARAnalytics.providerInstance(of: HockeyAppProvider.self)
        var analyticsLog: BITHockeyAttachment?

        let processID = ProcessInfo.processInfo.processIdentifier
        if let messages = hockeyProvider?.messages(forProcessID: UInt(processID)) as? [String] {
            let message = messages.joined(separator: "\n")
            let data = message.data(using: String.Encoding.utf8)
            analyticsLog = BITHockeyAttachment(filename: "analytics_log.txt", hockeyAttachmentData: data, contentType: "text")
        }

        var messages: [String] = []
        let user = User.current().name ?? "Onboarding user"
        messages.append("From: \(user)")

        let staging = UserDefaults.standard.bool(forKey:ARUseStagingDefault)
        messages.append(staging ? "On: Staging" : "On: Production")

        messages.append("Signal: \(getSignalStrength())")

        var items = [AnyObject]()
        if let image = image {
            items.append(image)
        }
        if let video = data {
            messages.append("Attatched a video")
            items.append(BITHockeyAttachment(filename: "video.mp4", hockeyAttachmentData: video, contentType: "mp4"))
        }
        if let analyticsLog = analyticsLog {
            items.append(analyticsLog)
        }

        items.append(NSString(string: messages.joined(separator: "\n").appending("\n\n")))

        let vc = BITHockeyManager.shared().feedbackManager
        vc.showFeedbackComposeView(withPreparedItems: items)
        ARTopMenuViewController.shared().view.alpha = 1
    }

    // From the looks of this SO, we should be fine with submitting this.
    // If there are problems, we can remove it. It's a nice to have.
    // http://stackoverflow.com/questions/4954389/measuring-cellular-signal-strength
    func getSignalStrength() -> Int {

        let application = UIApplication.shared
        let statusBarView = application.value(forKey: "statusBar") as! UIView
        let foregroundView = statusBarView.value(forKey: "foregroundView") as! UIView
        let foregroundViewSubviews = foregroundView.subviews

        var dataNetworkItemView:UIView!

        for subview in foregroundViewSubviews {
            if subview.isKind(of: NSClassFromString("UIStatusBarSignalStrengthItemView")!) {
                dataNetworkItemView = subview
                break
            } else {
                return 0 //NO SERVICE
            }
        }
        
        return dataNetworkItemView.value(forKey: "signalStrengthBars") as! Int
    }

    func showFeedbackWithRecentScreenshot() {
        let fetch = PHFetchOptions()
        fetch.fetchLimit = 1
        fetch.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
        fetch.predicate = NSPredicate(format:"(mediaSubtype & %d) != 0", PHAssetMediaSubtype.photoScreenshot.rawValue)

        let results = PHAsset.fetchAssets(with: .image, options: fetch)
        guard let result = results.firstObject else {
            // Skipping
            self.showFeedback()
            return
        }

        let options = PHImageRequestOptions()
        options.isSynchronous = true
        PHImageManager.default().requestImage(for: result, targetSize: UIScreen.main.bounds.size, contentMode: .aspectFit, options: options) { image, info in
            self.showFeedback(image)
        }
    }
}

extension ARHockeyFeedbackDelegate: RPPreviewViewControllerDelegate {
    func previewController(_ previewController: RPPreviewViewController, didFinishWithActivityTypes activityTypes: Set<String>) {

        previewController.navigationController?.popViewController(animated: true)

        ar_dispatch_after(1) {
            let fetch = PHFetchOptions()
            fetch.fetchLimit = 1
            fetch.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]

            let results = PHAsset.fetchAssets(with: .video, options: fetch)
            guard let result = results.firstObject else {
                // Skipping
                self.showFeedback()
                return
            }

            let options = PHVideoRequestOptions()
            options.isNetworkAccessAllowed = false
            PHImageManager.default().requestAVAsset(forVideo: result, options: options) { (video, mix, other) in

                if let avassetURL = video as? AVURLAsset {
                    guard let video = try? Data(contentsOf: avassetURL.url) else { return }
                    self.showFeedback(nil, data: video)
                }
            }
        }
    }
}
