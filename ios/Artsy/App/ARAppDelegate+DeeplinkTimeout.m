#import "ARAppDelegate+DeeplinkTimeout.h"
#import <Sentry/Sentry.h>

@implementation ARAppDelegate (DeeplinkTimeout)

NSString *deeplinkRoute;

- (void)startDeeplinkTimeoutWithRoute:(NSString *)route {
    deeplinkRoute = route;
    [self invalidateDeeplinkTimeout];
    [self performSelector:@selector(deeplinkTimeoutExpired) withObject:nil afterDelay:10.0];
}

- (void)invalidateDeeplinkTimeout {
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(deeplinkTimeoutExpired) object:nil];
}

- (void)deeplinkTimeoutExpired {
    if (deeplinkRoute) {
        [SentrySDK captureMessage:@"Deeplink timeout: Navigation did not complete in time"];
        [SentrySDK configureScope:^(SentryScope * _Nonnull scope) {
            [scope setExtraValue:deeplinkRoute forKey:@"deeplink_route"];
        }];
    } else {
        [SentrySDK captureMessage:@"Deeplink timeout: Navigation did not complete in time"];
    }
    deeplinkRoute = nil;
}

@end
