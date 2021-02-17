#import <React/RCTViewManager.h>

@interface ARInternalWebViewManager : RCTViewManager
@property (nonatomic, strong, readwrite) NSString *route;
@property (nonatomic, assign) BOOL showFullScreen;
@end
