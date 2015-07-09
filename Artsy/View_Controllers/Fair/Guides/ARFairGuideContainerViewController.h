#import <UIKit/UIKit.h>


@interface ARFairGuideContainerViewController : UIViewController

- (instancetype)initWithFair:(Fair *)fair __attribute((objc_designated_initializer));
- (instancetype)init __attribute__((unavailable("Designated Initializer initWithFair: must be used.")));

@property (nonatomic, strong) Fair *fair;
@property (nonatomic, assign) BOOL animatedTransitions; //Defaults to YES

@end
