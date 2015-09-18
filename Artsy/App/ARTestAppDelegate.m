@import iRate;

#import "ARTestAppDelegate.h"
#import "ARRouter.h"
#import "ARLogger.h"

/// Acts as an App Delegate, but as it is loaded from
/// the test bundle - as of Xcode 7 this seems to be loaded
/// after the UIApplicationDelegate methods get called.
///
/// So, we abuse +load to do the usual setup calls.


@implementation ARTestAppDelegate

+ (void)load
{
    ARPerformWorkAsynchronously = NO;
    [ARRouter setup];

    /// Never run in tests
    [[iRate sharedInstance] setRatedThisVersion:YES];

    /// Not really sure what this is for
    [[ARLogger sharedLogger] startLogging];
}

@end
