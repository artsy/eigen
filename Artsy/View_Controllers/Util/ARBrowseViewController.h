#import <UIKit/UIKit.h>

#import "ARBrowseNetworkModel.h"
#import "ARRootViewController.h"

@interface ARBrowseViewController : UIViewController <ARRootViewController>
@property (nonatomic, strong, readonly) UICollectionView *collectionView;
@property (nonatomic, strong, readwrite) ARBrowseNetworkModel *networkModel;
@end
