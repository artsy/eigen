import UIKit

class LiveAuctionView: UIView {

  weak var liveSaleViewController: LiveAuctionViewController?

  private var slug : String?

  override func layoutSubviews() {
    super.layoutSubviews()

    if let slug = slug, liveSaleViewController == nil {
      embed(slug: slug)
    } else {
      liveSaleViewController?.view.frame = bounds
    }
  }

  @objc func setSlug(slug: String) {
    self.slug = slug
  }

  private func embed(slug: String) {
    guard
        let parentVC = parentViewController
    else {
        return
    }

    let vc = LiveAuctionViewController(saleSlugOrID: slug)
    parentVC.addChild(vc)
    addSubview(vc.view)
    vc.view.frame = bounds
    vc.didMove(toParent: parentVC)
    self.liveSaleViewController = vc
  }

  var parentViewController: UIViewController? {
      var parentResponder: UIResponder? = self
      while parentResponder != nil {
          parentResponder = parentResponder!.next
          if let viewController = parentResponder as? UIViewController {
              return viewController
          }
      }
      return nil
  }
}
