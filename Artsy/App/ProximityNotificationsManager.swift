import Foundation
import CoreLocation

@objc class ProximityNotificationsManager : NSObject, CLLocationManagerDelegate {
    @objc static let sharedInstance = ProximityNotificationsManager()

    var locationManager : CLLocationManager?

    // probably want more permanent storage e.g. NSUserDefaults
    var storedLocations : [String: StoredLocation] = [:]

    enum LocationType {
        case Show
        case Gallery
    }

    struct StoredLocation {
        let id : String
        let name : String
        let href : String
        let imageURL : String
        let type : LocationType
        let lat : Double
        let lon : Double
    }


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
        self.storedLocations.removeAll()

        let closest20RawLocations = Array(rawRegions[0..<20])
        for rawLocation in closest20RawLocations {
            if let location = self.locationFromLocationDict(locationDict: rawLocation) {
                self.storedLocations[location.id] = location
                let region = self.regionFromLocation(location: location)
                print("NTFY start monitoring region", region.identifier)
                print("NTFY start monitoring region center", region.center)
                self.locationManager?.startMonitoring(for: region)
            }
        }
    }

    func locationFromLocationDict(locationDict: [String: Any]) -> StoredLocation? {
        guard
            let lat = locationDict["lat"] as? Double,
            let lon = locationDict["lng"] as? Double,
            let id = locationDict["href"] as? String,
            let name = locationDict["name"] as? String,
            let typeStr = locationDict["type"] as? String,
            let imageURL = locationDict["image_url"] as? String
        else {
            return nil
        }

        var type = LocationType.Gallery
        if typeStr == "show" {
            type = LocationType.Show
        }

        return StoredLocation(id: id,
                              name: name,
                              href: id,
                              imageURL: imageURL,
                              type: type,
                              lat: lat,
                              lon: lon)
    }

    func regionFromLocation(location: StoredLocation) -> CLCircularRegion {
        let center = CLLocationCoordinate2D(latitude: location.lat, longitude: location.lon)
        let radius : CLLocationDistance = 1000 // 1000m - probably needs tweaking
        let region = CLCircularRegion(center: center, radius: radius, identifier: location.id)
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
        // TODO: How to handle entering multiple regions, debounce?
        print("NTFY location manager region entrance event", region.identifier)

        if UIApplication.shared.applicationState != .active {
            guard let notificationContent = notificationContent(regionId: region.identifier) else {
                return
            }
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

    func notificationContent(regionId: String) -> UNNotificationContent? {
        guard let retrievedLocation = storedLocations[regionId] else {
            return nil
        }
        let notificationContent = UNMutableNotificationContent()

        switch retrievedLocation.type {
        case .Show:
            notificationContent.title = "Show nearby!"
        case .Gallery:
            notificationContent.title = "Gallery nearby!"
        }
        notificationContent.body = "You are only a couple blocks from art at \(retrievedLocation.name), check it out!"
        notificationContent.userInfo = ["url": retrievedLocation.href ]
        notificationContent.sound = .default
        notificationContent.badge = UIApplication.shared.applicationIconBadgeNumber + 1 as NSNumber
        return notificationContent
    }
}
