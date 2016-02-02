#import <UIKit/UIKit.h>

#import "FeaturedLink.h"


@interface ARBrowseFeaturedLinksCollectionViewCell : UICollectionViewCell

- (void)updateWithTitle:(NSString *)title imageURL:(NSURL *)imageURL;

+ (NSString *)reuseID;

@property (nonatomic, strong, readonly) UIImageView *imageView;
@property (nonatomic, strong, readonly) UILabel *titleLabel;

@end
