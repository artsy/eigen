#import <WatchKit/WatchKit.h>

@interface ARWatchBidPlacingViewController : WKInterfaceController

@property (strong, nonatomic) IBOutlet WKInterfaceLabel *titleLabel;
@property (strong, nonatomic) IBOutlet WKInterfaceImage *image;

@property (strong, nonatomic) IBOutlet WKInterfaceGroup *bidAgainGroup;
@property (strong, nonatomic) IBOutlet WKInterfaceGroup *doneButtonGroup;

@end
