import Foundation
import Keys
import Aerodramus

class ArtsyEcho: Aerodramus {

    convenience override init() {
        let keys = ArtsyKeys()
        let url = NSURL(string: "https://echo-api-production.herokuapp.com/")!
        self.init(serverURL: url, accountID: 1, APIKey: keys.artsyEchoProductionToken(), localFilename: "Echo")
    }

}
