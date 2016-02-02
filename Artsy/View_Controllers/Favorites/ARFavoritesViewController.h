#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, ARFavoritesDisplayMode) {
    ARFavoritesDisplayModeArtworks,
    ARFavoritesDisplayModeArtists,
    ARFavoritesDisplayModeGenes
};


@interface ARFavoritesViewController : UIViewController
@property (nonatomic, assign, readwrite) ARFavoritesDisplayMode displayMode;
- (UICollectionView *)collectionView;
@end
