#import <Foundation/Foundation.h>


NSInteger const ARSwitchViewFavoriteArtworksIndex = 0;
NSInteger const ARSwitchViewFavoriteArtistsIndex = 1;
NSInteger const ARSwitchViewFavoriteCategoriesIndex = 2;

#import "ARSwitchView+Favorites.h"


@implementation ARSwitchView (Favorites)

+ (NSArray *)favoritesButtonsTitlesArray
{
    return @[ @"ARTWORKS", @"ARTISTS", @"CATEGORIES" ];
}
@end
