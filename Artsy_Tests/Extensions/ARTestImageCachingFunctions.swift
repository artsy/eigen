import UIKit
import SDWebImage

func cacheColoredImageForURL(_ url: URL?, color: UIColor = UIColor.debugColourPurple()) {
    precondition(url != nil)

    let image = UIImage(data: color, scale: CGSize(width: 500, height: 500))
    SDWebImageManager.sharedManager().saveImageToCache(image, forURL: url!)
}
