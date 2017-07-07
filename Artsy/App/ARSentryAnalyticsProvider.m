#import "ARSentryAnalyticsProvider.h"

#import <Sentry/SentryClient.h>
#import <Sentry/SentryUser.h>
#import <Sentry/SentryBreadcrumb.h>
#import <Sentry/SentryBreadcrumbStore.h>

@implementation ARSentryAnalyticsProvider

- (id)initWithDSN:(NSString *)DSN
{
    self = [super init];
    if (!self) { return nil; }
    
    NSError *error = nil;
    SentryClient *client = [[SentryClient alloc] initWithDsn:DSN didFailWithError:&error];
    NSAssert(error == nil, @"Unable to initialize a SentryClient SDK: %@", error);
    error = nil;
    [client startCrashHandlerWithError:&error];
    NSAssert(error == nil, @"Unable to start the Sentry crash handler: %@", error);
    [SentryClient setSharedClient:client];
    
    return self;
}

- (void)identifyUserWithID:(NSString *)userID andEmailAddress:(NSString *)email
{
    if (userID) {
        NSParameterAssert(email);
        SentryUser *user = [[SentryUser alloc] initWithUserId:userID];
        user.email = email;
        user.username = email;
        SentryClient.sharedClient.user = user;
    }
}

// An event in Sentry terms is a crash, so in this case we're sending along events from analytics as breadcrumbs

- (void)event:(NSString *)event withProperties:(NSDictionary *)properties
{
    SentryBreadcrumb *breadcrumb = [[SentryBreadcrumb alloc] initWithLevel:kSentrySeverityDebug category:event];
    breadcrumb.data = properties;
    breadcrumb.timestamp = [NSDate new];
    [SentryClient.sharedClient.breadcrumbs addBreadcrumb:breadcrumb];
}

@end
