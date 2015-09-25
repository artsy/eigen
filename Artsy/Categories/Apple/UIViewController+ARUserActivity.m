#import "UIViewController+ARUserActivity.h"
#import "ARUserActivity.h"

@implementation UIViewController (ARUserActivity)

- (void)setAr_userActivityEntity:(id<ARSpotlightMetadataProvider>)entity;
{
    @_weakify(self);
    [self ar_withLoadedData:^{
        @_strongify(self);
        if (self) {
            self.userActivity = [ARUserActivity activityForEntity:entity];
            [self.userActivity becomeCurrent];
        }
    }];
}

@end
