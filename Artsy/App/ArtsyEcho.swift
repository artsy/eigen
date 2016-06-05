import Foundation
import Keys
import Aerodramus

class ArtsyEcho: Aerodramus {

    convenience override init() {
        let keys = ArtsyKeys()
        let url = NSURL(string: "https://echo-api-production.herokuapp.com/")! // swiftlint:disable:this force_unwrapping
        self.init(serverURL: url, accountID: 1, APIKey: keys.artsyEchoProductionToken(), localFilename: "Echo")
    }

}
