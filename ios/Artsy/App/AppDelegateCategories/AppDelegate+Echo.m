#import "AppDelegate+Echo.h"

@implementation ARAppDelegate (Echo)

- (void)setupEcho
{
    ArtsyEcho *aero = self.echo;
    
    // Only allow Echo to get set up once per instance.
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [aero checkForUpdates:^(BOOL updatedDataOnServer) {
            if (!updatedDataOnServer) return;
            
            [aero update:^(BOOL updated, NSError *error) {}];
        }];
    });    
}


@end
