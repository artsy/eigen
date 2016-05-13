import Foundation

/// Turns a dictionary into its corresponding JSON representation.
/// Note: The object must be only Foundational collection classes, strings, and numbers. JSON stuff.
extension NSObject {
    func stringify(prettyPrinted: Bool = false) throws -> String {
        let data = try NSJSONSerialization.dataWithJSONObject(self, options: prettyPrinted ? [.PrettyPrinted] : [])
        // Note we're using the crash! operator. At this point in the function execution, we
        // have successfully encoded ourselves into JSON and decoding into a string should succeed.
        // Otherwise Foundation is broken.
        return NSString(data: data, encoding: NSUTF8StringEncoding)! as String
    }
}
