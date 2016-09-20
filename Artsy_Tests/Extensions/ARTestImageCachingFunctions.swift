import UIKit
import SDWebImage

func cacheColoredImageForURL(url: NSURL?, color: UIColor = UIColor.debugColourPurple()) {
    precondition(url != nil)

    let image = UIImage(fromColor: color, withSize: CGSize(width: 500, height: 500))
    SDWebImageManager.sharedManager().saveImageToCache(image, forURL: url!)
}
