import Foundation
import CoreLocation

@objc class ProximityNotificationsManager : NSObject {
    @objc static let sharedInstance = ProximityNotificationsManager()

    lazy var locationManager = CLLocationManager()

    @objc func hasPermissionToTrackRegions() -> Bool {
        return CLLocationManager.isMonitoringAvailable(for: CLCircularRegion.self)
    }
}
