#import "ARAdminPreloadTableViewCell.h"

@implementation ARAdminPreloadTableViewCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier;
{
  if ((self = [super initWithStyle:style reuseIdentifier:reuseIdentifier])) {
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    [button setImage:[UIImage imageNamed:@"UITabBarDownloadsTemplate"] forState:UIControlStateNormal];
    [button sizeToFit];
    [button addTarget:self action:@selector(invokePreloadBlock) forControlEvents:UIControlEventTouchUpInside];
    self.accessoryView = button;
  }
  return self;
}

- (void)invokePreloadBlock;
{
  self.preloadBlock();
}

@end
