#import <WatchKit/WatchKit.h>


@interface ARWatchShowRowController : NSObject
@property (weak, nonatomic) IBOutlet WKInterfaceLabel *partnerNameLabel;
@property (weak, nonatomic) IBOutlet WKInterfaceLabel *showNameLabel;
@property (weak, nonatomic) IBOutlet WKInterfaceLabel *distanceLabel;
@end


@interface ARWatchShowSetViewController : WKInterfaceController
@property (strong, nonatomic) IBOutlet WKInterfaceTable *table;
@end
