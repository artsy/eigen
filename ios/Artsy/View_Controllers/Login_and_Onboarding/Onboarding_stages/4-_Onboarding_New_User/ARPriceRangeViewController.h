#import <UIKit/UIKit.h>
@class AROnboardingViewController;


@protocol ARPersonalizeContainer <NSObject>
@required
- (void)budgetSelected;
@end


@interface ARPriceRangeViewController : UITableViewController

@property (nonatomic, weak) id<ARPersonalizeContainer> delegate;
@property (nonatomic, strong, readonly) NSNumber *rangeValue;

@end
