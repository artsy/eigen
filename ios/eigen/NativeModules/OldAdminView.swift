import UIKit

class OldAdminView: UIView {
  weak var oldAdminViewController: UIViewController?

  override func layoutSubviews() {
      super.layoutSubviews()

      if oldAdminViewController == nil {
          embed()
      } else {
          oldAdminViewController?.view.frame = bounds
      }
  }

  private func embed() {
      guard
          let parentVC = parentViewController
      else {
          return
      }

      let vc = UIViewController()
      vc.view.backgroundColor = UIColor.purple
      parentVC.addChild(vc)
      addSubview(vc.view)
      vc.view.frame = bounds
      vc.didMove(toParent: parentVC)
      self.oldAdminViewController = vc
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
