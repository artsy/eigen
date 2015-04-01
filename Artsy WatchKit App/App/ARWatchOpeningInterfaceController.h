#import <WatchKit/WatchKit.h>
#import <Foundation/Foundation.h>

@interface ARWatchHomeRowController : NSObject
@property (weak, nonatomic) IBOutlet WKInterfaceLabel *titleLabel;
@end


@interface ARWatchOpeningInterfaceController : WKInterfaceController

@property (strong, nonatomic) IBOutlet WKInterfaceTable *table;

@property (strong, nonatomic) IBOutlet WKInterfaceGroup *logInMessageGroup;

@end
