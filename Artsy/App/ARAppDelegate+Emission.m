#import "ARAppDelegate+Emission.h"

#import <Emission/AREmission.h>


@implementation ARAppDelegate (Emission)

- (void)setupEmission;
{
    AREmission *emission = [AREmission sharedInstance];
}

@end
