#import "ARArtsyWebViewManager.h"
#import "ARArtsyWebView.h"
#import <objc/runtime.h>

@interface ARArtsyWebViewManager () <RNCWebViewDelegate>
@end

@interface RNCWebViewManager()

- (BOOL) webView:(RNCWebView *)webView
shouldStartLoadForRequest:(NSMutableDictionary<NSString *, id> *)request
    withCallback:(RCTDirectEventBlock)callback;

@end

@implementation ARArtsyWebViewManager {}

RCT_EXPORT_MODULE();

- (UIView *)view
{
  ARArtsyWebView *webView = [ARArtsyWebView new];
  webView.delegate = self;
  return webView;
}

- (BOOL) webView:(RNCWebView *)webView
shouldStartLoadForRequest:(NSMutableDictionary<NSString *, id> *)request
             withCallback:(RCTDirectEventBlock)callback
{
    return [super webView:webView shouldStartLoadForRequest:request withCallback:callback];
}

@end
