import UIKit

func cacheColoredImageForURL(_ url: URL?, color: UIColor = UIColor.debugColourPurple()) {
    precondition(url != nil)

    let image = UIImage(from: color, with: CGSize(width: 500, height: 500))
    SDWebImageManager.shared.imageCache.store(image, imageData: nil, forKey: url!.absoluteString, cacheType: .all, completion: nil)
}
