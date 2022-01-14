import Foundation
import CoreLocation

@objc class ProximityNotificationsManager : NSObject, CLLocationManagerDelegate {
    @objc static let sharedInstance = ProximityNotificationsManager()

    let locationUpdateKey = "ART_LOCATION_UPDATED"

    var locationManager : CLLocationManager?

    @objc func hasPermissionToTrackRegions() -> Bool {
        return CLLocationManager.isMonitoringAvailable(for: CLCircularRegion.self)
    }

    @objc func startTrackingProximity() {
        // I forgot how fun worrying about stuff like this was
        DispatchQueue.main.async {
            self.locationManager = CLLocationManager()
            self.locationManager?.delegate = self
            // TODO: Configure accuracy so we are not killing user battery
            self.locationManager?.requestAlwaysAuthorization()
            self.locationManager?.startUpdatingLocation()
        }
    }

    // MARK: CLLocationManagerDelegate

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.first else {
            return
        }

        // TODO: This method can be type safe
        AREmission.sharedInstance().sendLocationEvent([
            "lat": location.coordinate.latitude,
            "lon": location.coordinate.longitude,
        ])
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("NTFY location manager failed with error", error)
    }
}
