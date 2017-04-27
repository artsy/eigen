#import <UIKit/UIKit.h>
#import "ARRootViewController.h"

typedef NS_ENUM(NSInteger, ARFavoritesDisplayMode) {
    ARFavoritesDisplayModeArtworks,
    ARFavoritesDisplayModeArtists,
    ARFavoritesDisplayModeGenes
};


@interface ARFavoritesViewController : UIViewController <ARRootViewController>
@property (nonatomic, assign, readwrite) ARFavoritesDisplayMode displayMode;
- (UICollectionView *)collectionView;
@end
