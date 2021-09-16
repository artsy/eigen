import Foundation

/// Turns a dictionary into its corresponding JSON representation.
/// Note: The object must be only Foundational collection classes, strings, and numbers. JSON stuff.
extension NSObject {
    func stringify(_ prettyPrinted: Bool = false) throws -> String {
        let data = try JSONSerialization.data(withJSONObject: self, options: prettyPrinted ? [.prettyPrinted] : [])
        // Note we're using the crash! operator. At this point in the function execution, we
        // have successfully encoded ourselves into JSON and decoding into a string should succeed.
        // Otherwise Foundation is broken.
        return (NSString(data: data, encoding: String.Encoding.utf8.rawValue) ?? "") as String
    }
}
