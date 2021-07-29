#import "ARSegmentProvider.h"
#import "ARAnalyticsProviders.h"
#import "SEGAnalytics.h"

@interface ARSegmentProvider ()
@property (nonatomic, copy) NSDictionary *traits;
@end

@implementation ARSegmentProvider

/*
 * Overrides initializer to disable tracking the idfa in the Segment config
 * the rest of the provider's functionality should be the same
 */
- (instancetype)initWithIdentifier:(NSString *)identifier integrations:(NSArray *)integrations {
    if ((self = [super init])) {
        SEGAnalyticsConfiguration *config = [SEGAnalyticsConfiguration configurationWithWriteKey:identifier];
        config.enableAdvertisingTracking = NO;
        for (id integration in integrations) {
             [config use:integration];
        }
        [SEGAnalytics setupWithConfiguration:config];
        _traits = @{};
     }
     return self;
}

/*
 * Overrides identify call to not pass emails to Segment
 */
- (void)identifyUserWithID:(NSString *)userID anonymousID:(NSString *)anonymousID andEmailAddress:(NSString *)email {
    [super identifyUserWithID:userID anonymousID:anonymousID andEmailAddress:nil];
}

@end

