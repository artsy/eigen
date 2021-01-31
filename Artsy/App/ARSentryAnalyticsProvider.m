#import "ARSentryAnalyticsProvider.h"
#import <Sentry/SentryClient.h>
#import <Sentry/SentryUser.h>
#import <Sentry/SentryBreadcrumb.h>
#import <Sentry/SentrySDK.h>
#import <Sentry/SentryOptions.h>

@implementation ARSentryAnalyticsProvider

- (id)initWithDSN:(NSString *)DSN
{
    self = [super init];
    if (!self) { return nil; }

    [SentrySDK startWithConfigureOptions:^(SentryOptions *options) {
        options.dsn = DSN;
        options.debug = @YES; // Enabled debug when first installing is always helpful
    }];
    
    return self;
}

- (void)identifyUserWithID:(NSString *)userID andEmailAddress:(NSString *)email
{
    if (userID) {
        NSParameterAssert(email);
        SentryUser *user = [[SentryUser alloc] initWithUserId:userID];
        user.email = email;
        user.username = email;
        [SentrySDK setUser:user];
    }
}

// An event in Sentry terms is a crash, so in this case we're sending along events from analytics as breadcrumbs

- (void)event:(NSString *)event withProperties:(NSDictionary *)properties
{
    SentryBreadcrumb *breadcrumb = [[SentryBreadcrumb alloc] initWithLevel:kSentryLevelDebug category:event];
    breadcrumb.data = properties;
    breadcrumb.timestamp = [NSDate new];
    [SentrySDK addBreadcrumb:breadcrumb];
}

@end
 
