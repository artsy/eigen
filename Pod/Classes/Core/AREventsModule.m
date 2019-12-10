#import "AREventsModule.h"

#import <StoreKit/SKStoreReviewController.h>

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>
#import <React/RCTRootView.h>

@implementation AREventsModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(postEvent:(nonnull NSDictionary *)info)
{
    self.eventOccurred(info);
}

RCT_EXPORT_METHOD(requestAppStoreRating)
{
    if (@available(iOS 10.3, *)) {
        [SKStoreReviewController requestReview];
    } else {
        // Fallback on earlier versions
    }
}

@end
