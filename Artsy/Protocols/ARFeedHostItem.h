#import <Foundation/Foundation.h>


@protocol ARFeedHostItem <NSObject>

/// The selector that is used to pass the hosted object back to the
/// host with.
- (SEL)setHostPropertySelector;

/// The class that the hosted object will be created with.
- (Class)hostedObjectClass;

@end
