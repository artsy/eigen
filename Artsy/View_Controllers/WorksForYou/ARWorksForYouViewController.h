#import <UIKit/UIKit.h>
#import "ARWorksForYouNetworkModel.h"


@interface ARWorksForYouViewController : UIViewController
@property (nonatomic, strong, readonly) id<ARWorksForYouNetworkModelable> worksForYouNetworkModel;
@end
