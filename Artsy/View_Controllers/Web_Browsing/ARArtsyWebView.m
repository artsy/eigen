#import "ARArtsyWebView.h"

@interface ARArtsyWebView ()

- (void) webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler;
- (NSMutableDictionary<NSString *, id> *)baseEvent;

@property (nonatomic, copy) RCTDirectEventBlock onShouldStartLoadWithRequest;
@property (nonatomic, copy) RCTDirectEventBlock onLoadingStart;
@property (nonatomic, copy) WKWebView *webView;

@end

@implementation ARArtsyWebView

@dynamic webView;
@dynamic onShouldStartLoadWithRequest;
@dynamic onLoadingStart;

- (WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures
{
  if (!navigationAction.targetFrame.isMainFrame) {
    _requestingNewWindow = YES;
    [webView loadRequest:navigationAction.request];
  }
  return nil;
}

- (void) webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler
{
    static NSDictionary<NSNumber *, NSString *> *navigationTypes;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
      navigationTypes = @{
        @(WKNavigationTypeLinkActivated): @"click",
        @(WKNavigationTypeFormSubmitted): @"formsubmit",
        @(WKNavigationTypeBackForward): @"backforward",
        @(WKNavigationTypeReload): @"reload",
        @(WKNavigationTypeFormResubmitted): @"formresubmit",
        @(WKNavigationTypeOther): @"other",
      };
    });

    WKNavigationType navigationType = navigationAction.navigationType;
    NSURLRequest *request = navigationAction.request;
    BOOL isTopFrame = [request.URL isEqual:request.mainDocumentURL];

    if (self.onShouldStartLoadWithRequest) {
      NSMutableDictionary<NSString *, id> *event = [self baseEvent];
      [event addEntriesFromDictionary: @{
        @"url": (request.URL).absoluteString,
        @"mainDocumentURL": (request.mainDocumentURL).absoluteString,
        @"navigationType": navigationTypes[@(navigationType)],
        @"isTopFrame": @(isTopFrame),
        @"requestingNewWindow": @(_requestingNewWindow),
      }];
      _requestingNewWindow = NO; // Reset to default
      if (![self.delegate webView:self
        shouldStartLoadForRequest:event
                     withCallback:self.onShouldStartLoadWithRequest]) {
        decisionHandler(WKNavigationActionPolicyCancel);
        return;
      }
    }

    if (self.onLoadingStart) {
      // We have this check to filter out iframe requests and whatnot
      if (isTopFrame) {
        NSMutableDictionary<NSString *, id> *event = [self baseEvent];
        [event addEntriesFromDictionary: @{
          @"url": (request.URL).absoluteString,
          @"navigationType": navigationTypes[@(navigationType)]
        }];
        self.onLoadingStart(event);
      }
    }

    // Allow all navigation by default
    decisionHandler(WKNavigationActionPolicyAllow);
}

- (NSMutableDictionary<NSString *, id> *)baseEvent
{
  NSDictionary *event = @{
    @"url": self.webView.URL.absoluteString ?: @"",
    @"title": self.webView.title ?: @"",
    @"loading" : @(self.webView.loading),
    @"canGoBack": @(self.webView.canGoBack),
    @"canGoForward" : @(self.webView.canGoForward)
  };
  return [[NSMutableDictionary alloc] initWithDictionary: event];
}

@end
