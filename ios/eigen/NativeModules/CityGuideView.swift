import UIKit

class CityGuideView: UIView {
  weak var mapContainerViewController: AREigenMapContainerViewController?

  override func layoutSubviews() {
      super.layoutSubviews()

      if mapContainerViewController == nil {
          embed()
      } else {
          mapContainerViewController?.view.frame = bounds
      }
  }

  private func embed() {
      guard
          let parentVC = parentViewController
      else {
          return
      }

      let vc = AREigenMapContainerViewController()
      parentVC.addChild(vc)
      addSubview(vc.view)
      vc.view.frame = bounds
      vc.didMove(toParent: parentVC)
      self.mapContainerViewController = vc
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
