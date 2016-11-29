@testable import Artsy

extension ARUserManager {

    /// Supports a block like logged in closure
    class func asLoggedInUser(_ closure: () -> ()) {
        self.stubAndLoginWithUsername()
        closure()
        self.clearUserData()
    }
}
