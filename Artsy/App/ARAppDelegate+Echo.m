#import "ARAppDelegate+Echo.h"
#import "ARAppDelegate+Emission.h"
#import "ARAppStatus.h"

@implementation ARAppDelegate (Echo)

- (void)setupEcho
{
    // Only allow Echo to get set up once per instance.
    if (self.isEchoSetup) {
        return;
    }
    self.isEchoSetup = YES;

    ArtsyEcho *aero = self.echo;

    [aero checkForUpdates:^(BOOL updatedDataOnServer) {
        if (!updatedDataOnServer) return;

        [aero update:^(BOOL updated, NSError *error) {
            if (!ARAppStatus.isRunningTests) {
                [[ARAppDelegate sharedInstance] updateEmissionOptions];
            }
        }];
    }];
}


@end
