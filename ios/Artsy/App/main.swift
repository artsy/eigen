import UIKit

let delegateClass: AnyClass

#if DEBUG
if NSClassFromString("XCTestCase") != nil {
    delegateClass = NSClassFromString("ARTestHelper") ?? AppDelegate.self
} else {
    delegateClass = AppDelegate.self
}
#else
delegateClass = AppDelegate.self
#endif

UIApplicationMain(
    CommandLine.argc,
    CommandLine.unsafeArgv,
    nil,
    NSStringFromClass(delegateClass)
)
