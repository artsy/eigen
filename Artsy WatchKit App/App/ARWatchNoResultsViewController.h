#import <WatchKit/WatchKit.h>
#import <Foundation/Foundation.h>

@interface ARWatchNoResultsViewController : WKInterfaceController

/// Use this to generate a dictionary to pass as the interface controller context
+ (NSDictionary *)contextWithTitle:(NSString *)title subtitle:(NSString *)subtitle;

@property (strong, nonatomic) IBOutlet WKInterfaceLabel *titleLabel;
@property (strong, nonatomic) IBOutlet WKInterfaceLabel *subtitleLabel;

@end
