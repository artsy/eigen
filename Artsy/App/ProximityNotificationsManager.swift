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
        print("NTFY location manager updateRegions event")

        self.stopMonitoringAllRegions()
        let closest20RawRegions = Array(rawRegions[0..<20])
        for rawRegion in closest20RawRegions {
            if let region = self.regionFromRawRegion(rawRegion: rawRegion) {
                print("NTFY start monitoring region", region.identifier)
                print("NTFY start monitoring region center", region.center)
                self.locationManager?.startMonitoring(for: region)
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
            print("NTFY stop monitoring region", region.identifier)
            locationManager.stopMonitoring(for: region)
        }
    }

    // MARK: CLLocationManagerDelegate

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        // TODO: find most accurate rather than first, is first most accurate?

        print("NTFY location manager didUpdateLocations")

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
        // TODO: How to handle entering multiple regions
        print("NTFY location manager region entrance event", region.identifier)

        if UIApplication.shared.applicationState != .active {
            let body = "You are near \(region.identifier), check it out!"
            let notificationContent = UNMutableNotificationContent()
            notificationContent.body = body
            notificationContent.userInfo = ["url": "partner/\(region.identifier)" ]
            notificationContent.sound = .default
            notificationContent.badge = UIApplication.shared.applicationIconBadgeNumber + 1 as NSNumber
                // 3
            let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
            let request = UNNotificationRequest(
                  identifier: "location_change",
                  content: notificationContent,
                  trigger: trigger)
            UNUserNotificationCenter.current().add(request) { error in
                if let error = error {
                    print("Error: \(error)")
                }
            }
        }
    }
}
