

#import "ARInternalMobileWebViewController.h"
#import "ARMenuAwareViewController.h"

/// Like the internal mobile web VC but will not allow showing a toolbar or back button


@interface AREndOfLineInternalMobileWebViewController : ARInternalMobileWebViewController <ARMenuAwareViewController>

@end
