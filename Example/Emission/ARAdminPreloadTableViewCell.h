#import <UIKit/UIKit.h>

@interface ARAdminPreloadTableViewCell : UITableViewCell
@property (nonatomic, copy) dispatch_block_t preloadBlock;
@end
