#import <UIKit/UIKit.h>

@interface ARInternalWebView : UIView

@property (nonatomic, weak) UIViewController *webViewController;
@property (nonatomic) NSString *route;
@property (nonatomic, assign) BOOL showFullScreen;

@end
