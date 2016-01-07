### 2.4.0

* Converted our routing engine to only handle the creation of view controllers and not showing them - orta
* Removed the settings view controller that isn't used - orta
* Removed the direct dependency on `libextobjc` from the app :tada: - orta
* Background data isn't parsed to JSON if we don't recieve a response - orta
* Restructured app launch to ensure no conflicts with background downloads - orta
* Correct development and store code sign/provisioning issues. - alloy
