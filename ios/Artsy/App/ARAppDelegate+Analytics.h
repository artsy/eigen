#import "ARAppDelegate.h"


@interface ARAppDelegate (Analytics)

- (void)trackDeeplinkWithTarget:(NSURL *)url referrer:(NSString *)referrer;

@end
