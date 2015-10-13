#import <UIKit/UIKit.h>

#import "ARMacros.h"

@class Fair;

@interface ARFairGuideContainerViewController : UIViewController

- (instancetype)initWithFair:(Fair *)fair AR_VC_DESIGNATED_INITIALIZER;

@property (nonatomic, strong) Fair *fair;
@property (nonatomic, assign) BOOL animatedTransitions; //Defaults to YES

@end
