import UIKit

func cacheColoredImageForURL(_ url: URL?, color: UIColor = UIColor.debugColourPurple()) {
    precondition(url != nil)

    let image = UIImage(from: color, with: CGSize(width: 500, height: 500))
//    SDWebImageManager.shared.saveImage(toCache: image, for: url!)
    SDWebImageManager.shared.loadImage(
        with: URL(string: url!.absoluteString),
            options: .highPriority,
            progress: nil) { (image, data, error, cacheType, isFinished, imageUrl) in
              print(isFinished)
          }
}
