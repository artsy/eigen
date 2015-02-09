#import "ARFairFavoritesNetworkModel.h"

@interface ARFairFavoritesNetworkModel ()

- (void)handleShowButtonPress:(PartnerShow *)show fair:(Fair *)fair;
- (void)handleArtworkButtonPress:(Artwork *)artwork fair:(Fair *)fair;
- (void)handleArtistButtonPress:(Artist *)artist fair:(Fair *)fair;

@end