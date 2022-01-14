import Foundation
import CoreLocation

@objc class ProximityNotificationsManager : NSObject, CLLocationManagerDelegate {
    @objc static let sharedInstance = ProximityNotificationsManager()

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
            self.locationManager?.allowsBackgroundLocationUpdates = true
            self.locationManager?.startUpdatingLocation()
        }
    }

    @objc func updateRegions(rawRegions: [[String: Any]]) {
        stopMonitoringAllRegions()
        let closest20RawRegions = Array(rawRegions[0..<20])
        for rawRegion in closest20RawRegions {
            if let region = regionFromRawRegion(rawRegion: rawRegion) {
                locationManager?.startMonitoring(for: region)
            }
        }
    }

    func regionFromRawRegion(rawRegion: [String: Any]) -> CLCircularRegion? {
        guard
            let lat = rawRegion["lat"] as? Double,
            let lon = rawRegion["lng"] as? Double,
            let id = rawRegion["id"] as? String
        else {
            return nil
        }

        let center = CLLocationCoordinate2D(latitude: lat, longitude: lon)
        let radius : CLLocationDistance = 1000 // 1000m - probably needs tweaking
        let region = CLCircularRegion(center: center, radius: radius, identifier: id)
        region.notifyOnEntry = true
        return region
    }


    func stopMonitoringAllRegions() {
        guard let locationManager = locationManager else {
            return
        }

        for region in locationManager.monitoredRegions {
            locationManager.stopMonitoring(for: region)
        }
    }

    // MARK: CLLocationManagerDelegate

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        // TODO: find most accurate rather than first, is first most accurate?
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

    func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) {
        print("NTFY location manager region entrance event", region)
    }
}
