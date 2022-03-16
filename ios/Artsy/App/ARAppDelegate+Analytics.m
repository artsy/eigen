// MARK: Formatter Exempt

#import "ARAppDelegate+Analytics.h"
#import "ARAnalyticsConstants.h"
#import <Emission/AREmission.h>

// Note the Eigen Schema:
// https://docs.google.com/spreadsheets/u/1/d/1bLbeOgVFaWzLSjxLOBDNOKs757-zBGoLSM1lIz3OPiI/edit#gid=497747862

@implementation ARAppDelegate (Analytics)

- (void)trackDeeplinkWithTarget:(NSURL *)url referrer:(NSString *)referrer {
    NSString *concreteReferrer = referrer ? referrer : @"unknown";
    [[AREmission sharedInstance] sendEvent:ARAnalyticsDeepLinkOpened traits:@{
        @"link" : url.absoluteString,
        @"referrer": concreteReferrer,
    }];
}

@end
