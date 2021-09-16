#import <UIKit/UIKit.h>

#import "UIViewController+WithLoadedData.h"
#import "ARUserActivity.h"

@interface UIViewController (ARUserActivity)

/// You should assign the entity that the VC represents to this every time the view is made active (ie from `viewDidAppear`) and call `-[UIViewController(WithLoadedData) ar_setDataLoaded]` once the data the VC cares about is loaded. This category will then take care of creating the user activity, assigning it to the VC, and make it the current activity. You are still responsible for invalidating the user activity when the view disappears.
- (void)setAr_userActivityEntity:(id<ARContinuityMetadataProvider>)entity;

@end
