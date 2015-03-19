#import "ARBrowseNetworkModel.h"

@interface ARBrowseViewController : UIViewController
@property (nonatomic, strong, readonly)UICollectionView *collectionView;
@property (nonatomic, strong, readwrite) ARBrowseNetworkModel *networkModel;
@end
