#import <Foundation/Foundation.h>
@class WKWebView;

// Problem: Hybrid Views can be slow

// Solution:
//   * Allow all WKWebViews to share a cache
//   * Have a collection of some pre-cached WKWebViews


/// The ARWebViewCacheHost is an object that makes sure
/// that all our in-app WKWebViews have a warmed martsy/force
/// cache and that they share any process information.


@interface ARWebViewCacheHost : NSObject

+ (void)startup;
- (WKWebView *)dequeueWebView;

@end
