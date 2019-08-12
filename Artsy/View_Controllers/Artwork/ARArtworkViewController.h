#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class Fair, Artwork;

@interface ARArtworkViewController : UIViewController

@property (assign, nonatomic) NSInteger index;
@property (strong, nonatomic, readonly) Artwork *artwork;
@property (strong, nonatomic, readonly, nullable) Fair *fair;

- (instancetype)initWithArtwork:(Artwork *)artwork fair:(nullable Fair *)fair NS_DESIGNATED_INITIALIZER;

- (UIImageView *)imageView;
- (void)setHasFinishedScrolling;
- (CGPoint)imageViewOffset;

@end

NS_ASSUME_NONNULL_END
