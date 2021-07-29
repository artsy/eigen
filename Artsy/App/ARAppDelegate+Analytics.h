#import "ARAppDelegate.h"


@interface ARAppDelegate (Analytics)

- (void)setupAnalytics;
- (void)trackDeeplinkWithTarget:(NSURL *)url referrer:(NSString *)referrer;

@end
