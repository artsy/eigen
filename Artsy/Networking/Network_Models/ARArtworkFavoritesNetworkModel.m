#import "ARArtworkFavoritesNetworkModel.h"

#import "ArtsyAPI+Artworks.h"
#import "User.h"


@implementation ARArtworkFavoritesNetworkModel

- (AFHTTPRequestOperation *)requestOperationAtPage:(NSInteger)page withSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    // When in Demo mode we show the details for app-store-reviewer
    // https://artsy.net/app-store-reviewer/favorites

    // TODO: We'll need to set the auction and sale artwork for each of these artworks. Probably easier to use metaphysics.
    NSString *userID = self.useSampleFavorites ? @"502d15746e721400020006fa" : [User currentUser].userID;
    return [ArtsyAPI getArtworkFromUserFavorites:userID page:page success:success failure:failure];
}

@end
