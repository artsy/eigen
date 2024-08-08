#import "ARAppDelegate+DeeplinkTimeout.h"
#import <Sentry/Sentry.h>

@implementation ARAppDelegate (DeeplinkTimeout)

- (void)startDeeplinkTimeout {
    [self invalidateDeeplinkTimeout];
    [self performSelector:@selector(deeplinkTimeoutExpired) withObject:nil afterDelay:10.0];
}

- (void)invalidateDeeplinkTimeout {
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(deeplinkTimeoutExpired) object:nil];
}

- (void)deeplinkTimeoutExpired {
    [SentrySDK captureMessage:@"Deeplink timeout: Navigation did not complete in time"];
}

@end
