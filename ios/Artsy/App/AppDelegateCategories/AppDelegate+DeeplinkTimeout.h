#import "AppDelegate.h"

@interface ARAppDelegate (DeeplinkTimeout)

- (void)startDeeplinkTimeoutWithRoute:(NSString *)route;
- (void)invalidateDeeplinkTimeout;

@end
