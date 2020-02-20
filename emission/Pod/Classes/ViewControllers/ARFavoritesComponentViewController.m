#import "ARFavoritesComponentViewController.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARFavoritesComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueries;
{
    return @[
        [[ARGraphQLQuery alloc] initWithQueryName:@"FavoriteArtworksQuery"],
        [[ARGraphQLQuery alloc] initWithQueryName:@"FavoriteArtistsQuery"],
        [[ARGraphQLQuery alloc] initWithQueryName:@"FavoriteCategoriesQuery"],
    ];
}

- (instancetype)init
{
    return [super initWithEmission:nil moduleName:@"Favorites" initialProperties:nil];
}

@end
