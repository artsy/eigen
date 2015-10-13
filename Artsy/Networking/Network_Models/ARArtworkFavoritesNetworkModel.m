#import "ARArtworkFavoritesNetworkModel.h"

#import "ArtsyAPI+Artworks.h"
#import "User.h"


@implementation ARArtworkFavoritesNetworkModel

- (void)performNetworkRequestAtPage:(NSInteger)page withSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    // When in Demo mode we show the details for app-store-reviewer
    // https://artsy.net/app-store-reviewer/favorites

    NSString *userID = self.useSampleFavorites ? @"502d15746e721400020006fa" : [User currentUser].userID;
    [ArtsyAPI getArtworkFromUserFavorites:userID page:page success:success failure:failure];
}

@end
