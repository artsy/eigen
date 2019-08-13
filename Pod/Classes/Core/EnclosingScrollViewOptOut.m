
#import "EnclosingScrollViewOptOut.h"
#import <UIKit/UIKit.h>
#import "AREmission.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTScrollView.h>

@interface RCTScrollView (EnclosingScrollView)
-(void)optOutOfParentScrollEvents;
@end

@implementation EnclosingScrollViewOptOut

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(optOutOfParentScrollEvents:(nonnull NSNumber *)tag)
{
    UIView* view = [[AREmission sharedInstance].bridge.uiManager viewForReactTag:tag];

    if ([view isKindOfClass:RCTScrollView.class]) {
        [((RCTScrollView *) view) optOutOfParentScrollEvents];
    }
}

@end
