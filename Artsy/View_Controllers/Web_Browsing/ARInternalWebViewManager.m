#import "ARInternalWebViewManager.h"
#import "ARInternalWebView.h"

@implementation ARInternalWebViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
    return [ARInternalWebView new];
}

RCT_EXPORT_VIEW_PROPERTY(route, NSString *)

@end
