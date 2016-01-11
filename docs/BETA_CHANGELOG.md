### 2.4.0

* Added Dangerfile to the repo - orta
* Send dsym to hockey - orta

### 2.3.2

* Converted our routing engine to only handle the creation of view controllers and not showing them - orta
* Removed the settings view controller that isn't used - orta
* Removed the direct dependency on `libextobjc` from the app :tada: - orta
* Background data isn't parsed to JSON if we don't recieve a response - orta
* Restructured app launch to ensure no conflicts with background downloads - orta
* Correct development and store code sign/provisioning issues. - alloy
* Slightly optimize app status (beta or dev vs app store) implementation. - alloy
* Include beta or dev vs app store flag in push notification registration. - alloy
