#import "UIViewController+ARUserActivity.h"
#import "ARUserActivity.h"

#import <Mantle/EXTScope.h>

@implementation UIViewController (ARUserActivity)

- (void)setAr_userActivityEntity:(id<ARSpotlightMetadataProvider>)entity;
{
    __weak typeof (self) wself = self;
    [self ar_withLoadedData:^{
        __strong typeof (wself) sself = wself;
        if (self) {
            sself.userActivity = [ARUserActivity activityForEntity:entity];
            [sself.userActivity becomeCurrent];
        }
    }];
}

@end
