// Generated using SwiftGen, by O.Halligon — https://github.com/AliSoftware/SwiftGen

import Foundation
import UIKit

protocol StoryboardSceneType {
  static var storyboardName: String { get }
}

extension StoryboardSceneType {
  static func storyboard() -> UIStoryboard {
    return UIStoryboard(name: self.storyboardName, bundle: nil)
  }

  static func initialViewController() -> UIViewController {
    return storyboard().instantiateInitialViewController()!
  }
}

extension StoryboardSceneType where Self: RawRepresentable, Self.RawValue == String {
  func viewController() -> UIViewController {
    return Self.storyboard().instantiateViewController(withIdentifier: self.rawValue)
  }
  static func viewController(_ identifier: Self) -> UIViewController {
    return identifier.viewController()
  }
}

protocol StoryboardSegueType: RawRepresentable { }

extension UIViewController {
  func performSegue<S: StoryboardSegueType>(_ segue: S, sender: AnyObject? = nil) where S.RawValue == String {
    self.performSegue(withIdentifier: segue.rawValue, sender: sender)
  }
}

struct StoryboardScene {
  enum LiveAuctions: String, StoryboardSceneType {
    static let storyboardName = "LiveAuctions"

    case BidScene = "bid"
    static func instantiateBid() -> LiveAuctionPlaceMaxBidViewController {
      return StoryboardScene.LiveAuctions.BidScene.viewController() as! LiveAuctionPlaceMaxBidViewController
    }
  }
}

struct StoryboardSegue {
}
