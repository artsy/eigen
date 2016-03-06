import UIKit
import React

public class ARComponentViewController : UIViewController {
  private var bridge: RCTBridge!
  private var moduleName: String!
  
  public init(bridge: RCTBridge!, moduleName: String!) {
    self.bridge = bridge
    self.moduleName = moduleName
    super.init(nibName: nil, bundle: nil)
  }

  required public init?(coder aDecoder: NSCoder) {
      fatalError("init(coder:) oh, Swift")
  }

  override public func viewDidLoad() {
    super.viewDidLoad()

    let rootView = RCTRootView(bridge: bridge, moduleName: moduleName, initialProperties: nil)
    view.addSubview(rootView)

    rootView.translatesAutoresizingMaskIntoConstraints = false
    view.addConstraints([
      NSLayoutConstraint.init(item: rootView, attribute: .Top, relatedBy: .Equal, toItem: topLayoutGuide, attribute: .Bottom, multiplier: 1, constant: 0),
      NSLayoutConstraint.init(item: rootView, attribute: .Leading, relatedBy: .Equal, toItem: view, attribute: .Leading, multiplier: 1, constant: 0),
      NSLayoutConstraint.init(item: rootView, attribute: .Trailing, relatedBy: .Equal, toItem: view, attribute: .Trailing, multiplier: 1, constant: 0),
      NSLayoutConstraint.init(item: rootView, attribute: .Bottom, relatedBy: .Equal, toItem: bottomLayoutGuide, attribute: .Top, multiplier: 1, constant: 0),
    ])
  }
}