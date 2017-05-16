#import "ARSentryAnalyticsProvider.h"
@import Sentry;

@implementation ARSentryAnalyticsProvider

- (id)initWithDSN:(NSString *)DSN
{
    self = [super init];
    if (!self) { return nil; }

    SentryClient *client = [[SentryClient alloc] initWithDsnString:DSN];
    [client startCrashHandler];
    [SentryClient setShared:client];
    return self;
}

- (void)identifyUserWithID:(NSString *)userID andEmailAddress:(NSString *)email
{
    [SentryClient shared].user = [[SentryUser alloc] initWithId:userID email:email username:email extra:@{}];
}

// An event in Sentry terms is a crash, so in this case we're sending along events from analytics as breadcrumbs

- (void)event:(NSString *)event withProperties:(NSDictionary *)properties
{
    SentryBreadcrumb *breadcrumb = [[SentryBreadcrumb alloc] initWithCategory:event timestamp:[NSDate new] message:nil type:nil level:SentrySeverityDebug data:properties];
    [[SentryClient shared].breadcrumbs add:breadcrumb];
}

@end
