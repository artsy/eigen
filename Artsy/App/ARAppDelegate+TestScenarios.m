#import "ARAppDelegate+TestScenarios.h"
#import "ARUserManager.h"


@implementation ARAppDelegate (TestScenarios)

- (void)setupIntegrationTests
{
    if ([[[NSProcessInfo processInfo] environment][@"TEST_SCENARIO"] isEqual:@"ONBOARDING"]) {
        [[ARUserManager sharedManager] disableSharedWebCredentials];
        [ARUserManager clearUserData];
    }
}

@end
