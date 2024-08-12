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

    NSError *deeplinkError = [NSError errorWithDomain:@"Deeplink timeout: Navigation did not complete in time" code:418 userInfo:@{ NSLocalizedDescriptionKey:@"Deeplink timeout: Navigation did not complete in time" }];
    if (deeplinkRoute) {
        [SentrySDK captureError:deeplinkError withScopeBlock:^(SentryScope * _Nonnull scope) {
            [scope setExtraValue:deeplinkRoute forKey:@"deeplink_route"];
        }];
    } else {
        [SentrySDK captureError:deeplinkError];
    }
    deeplinkRoute = nil;
}

@end
