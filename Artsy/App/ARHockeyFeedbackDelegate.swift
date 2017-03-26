import UIKit
import HockeySDK_Source
import Photos
import ARAnalytics

class ARHockeyFeedbackDelegate: NSObject {

    func listenForScreenshots() {
        let mainQueue = OperationQueue.main
        let notifications = NotificationCenter.default
        notifications.addObserver(forName: NSNotification.Name.UIApplicationUserDidTakeScreenshot, object: nil, queue: mainQueue) { notification in
            // When I looked at how Hockey did this, I found that they would delay by a second
            // presumably it can take a second to have the image saved in the asset store before
            // we can pull it out again. We might be able to get away with 0.5.
            ar_dispatch_after(0.5, self.showFeedbackWithRecentScreenshot)
        }
    }

    func showFeedback(_ image: UIImage? = nil) {
        let hockeyProvider = ARAnalytics.providerInstance(of: HockeyAppProvider.self)
        var analyticsLog: BITHockeyAttachment?

        let processID = ProcessInfo.processInfo.processIdentifier
        if let messages = hockeyProvider?.messages(forProcessID: UInt(processID)) as? [String] {
            let message = messages.joined(separator: "\n")
            let data = message.data(using: String.Encoding.utf8)
            analyticsLog = BITHockeyAttachment(filename: "analytics_log.txt", hockeyAttachmentData: data, contentType: "text")
        }

        let user = User.current()
        let initialMessage = NSString(string: "From: \(user?.name ?? "Onboarding user")\n\n")

        var items = [AnyObject]()
        items.append(initialMessage)
        if let image = image {
            items.append(image)
        }
        if let analyticsLog = analyticsLog {
            items.append(analyticsLog)
        }

        let vc = BITHockeyManager.shared().feedbackManager
        vc?.showFeedbackComposeView(withPreparedItems: items)
    }

    func showFeedbackWithRecentScreenshot() {
        let fetch = PHFetchOptions()
        fetch.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: true)]

        let results = PHAsset.fetchAssets(with: .image, options: fetch)
        guard let result = results.lastObject else {
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
