@import Foundation;

// Discussion: JSON decoding in Objective-C can return `NSNull` in the place of `nil` for
//             the JSON value of `null`. We want to avoid sending any messages to `NSNull`.

@interface NSObject (OrNil)
/// Returns `self`.
@property(nonatomic, readonly) id orNil;
@end

@interface NSNull (OrNil)
/// Returns `nil`.
@property(nonatomic, readonly) id orNil;
@end
