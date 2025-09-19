#import "ARAppDelegateHelper.h"

@interface ARAppDelegateHelper (DeeplinkTimeout)

- (void)startDeeplinkTimeoutWithRoute:(NSString *)route;
- (void)invalidateDeeplinkTimeout;

@end
