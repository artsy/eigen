import UIKit
import HockeySDK_Source
import Photos
import ARAnalytics

class ARHockeyFeedbackDelegate: NSObject {

    func listenForScreenshots() {
        let mainQueue = NSOperationQueue.mainQueue()
        let notifications = NSNotificationCenter.defaultCenter()
        notifications.addObserverForName(UIApplicationUserDidTakeScreenshotNotification, object: nil, queue: mainQueue) { notification in
            ar_dispatch_after(1.5, self.showFeedbackWithRecentScreenshot)
        }
    }

    func showFeedback(image:UIImage? = nil) {
        let hockeyProvider = ARAnalytics.providerInstanceOfClass(HockeyAppProvider.self)
        let processID = NSProcessInfo.processInfo().processIdentifier
        let messages = hockeyProvider.messagesForProcessID(UInt(processID)) as! [String]
        let message = messages.joinWithSeparator("\n")
        let data = message .dataUsingEncoding(NSUTF8StringEncoding)!

        var items:[AnyObject] = [data]
        if let screenshot = image {
            items.append(screenshot)
        }

        let vc = BITHockeyManager.sharedHockeyManager().feedbackManager
        vc.showFeedbackComposeViewWithPreparedItems(items)
    }

    func showFeedbackWithRecentScreenshot() {
        let fetch = PHFetchOptions()
        fetch.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: true)]

        let results = PHAsset.fetchAssetsWithMediaType(.Image, options: fetch)
        guard let result = results.lastObject as? PHAsset else {
            self.showFeedback()
            return
        }
        PHImageManager.defaultManager().requestImageForAsset(result, targetSize: UIScreen.mainScreen().bounds.size, contentMode: .AspectFit, options: nil) { image, info in
            self.showFeedback(image)
        }
    }
}
