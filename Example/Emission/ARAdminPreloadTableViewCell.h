#import <UIKit/UIKit.h>
#import "ARAdminTableViewCell.h"

@interface ARAdminPreloadTableViewCell : ARAdminTableViewCell
@property (nonatomic, copy) dispatch_block_t preloadBlock;
@end
