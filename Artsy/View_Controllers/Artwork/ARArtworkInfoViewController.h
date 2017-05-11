#import <UIKit/UIKit.h>

@class Artwork;

@interface ARArtworkInfoViewController : UIViewController

@property (nonatomic, strong) Artwork *artwork;

- (instancetype)initWithArtwork:(Artwork *)artwork;

@end
