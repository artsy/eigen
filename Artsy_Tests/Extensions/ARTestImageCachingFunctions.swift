import UIKit
import SDWebImage

func cacheColoredImageForURL(_ url: URL?, color: UIColor = UIColor.debugColourPurple()) {
    precondition(url != nil)

    let image = UIImage(from: color, with: CGSize(width: 500, height: 500))
    SDWebImageManager.shared().saveImage(toCache: image, for: url!)
}
