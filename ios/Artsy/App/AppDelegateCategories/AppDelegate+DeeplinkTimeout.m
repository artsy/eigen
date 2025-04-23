#import "AppDelegate+DeeplinkTimeout.h"
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

    NSError *deeplinkError = [NSError errorWithDomain:@"Navigation: Deeplink did not complete in time" code:418 userInfo:@{ NSLocalizedDescriptionKey:@"Navigation: deeplink did not complete in time" }];
    if (deeplinkRoute) {
        [SentrySDK captureError:deeplinkError withScopeBlock:^(SentryScope * _Nonnull scope) {
            [scope setExtraValue:deeplinkRoute forKey:@"route"];
        }];
    } else {
        [SentrySDK captureError:deeplinkError];
    }
    deeplinkRoute = nil;
}

@end
