import UIKit
import SDWebImage

func cacheColoredImageForURL(url: NSURL?, color: UIColor = UIColor.debugColourPurple()) {
    precondition(url != nil)

    let image = UIImage(fromColor: color)
    SDWebImageManager.sharedManager().saveImageToCache(image, forURL:url!)
}
