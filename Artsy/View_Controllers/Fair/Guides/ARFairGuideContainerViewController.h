#import <UIKit/UIKit.h>


@interface ARFairGuideContainerViewController : UIViewController

- (instancetype)initWithFair:(Fair *)fair AR_VC_DESIGNATED_INITIALIZER;

@property (nonatomic, strong) Fair *fair;
@property (nonatomic, assign) BOOL animatedTransitions; //Defaults to YES

@end
