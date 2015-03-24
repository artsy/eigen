#import <WatchKit/WatchKit.h>
#import <Foundation/Foundation.h>

@interface ARWatchLoadingViewController : WKInterfaceController

@property (strong, nonatomic) IBOutlet WKInterfaceLabel *titleLabel;
@property (strong, nonatomic) IBOutlet WKInterfaceImage *loadingIndicator;

@end
