#import <UIKit/UIKit.h>

@class ARFairFavoritesNetworkModel, Fair;

@protocol ARFairFavoritesNetworkModelDelegate <NSObject>

- (void)fairFavoritesNetworkModel:(ARFairFavoritesNetworkModel *)fairFavoritesNetworkModel shouldPresentViewController:(UIViewController *)viewController;

@end


@interface ARFairFavoritesNetworkModel : NSObject

- (void)getFavoritesForNavigationsButtonsForFair:(Fair *)fair
                                        artworks:(void (^)(NSArray *artworks))artworksBlock
                               artworksByArtists:(void (^)(NSArray *artworks))appendArtistArtworksBlock
                                      exhibitors:(void (^)(NSArray *exhibitors))exhibitorsBlock
                                         artists:(void (^)(NSArray *artists))artistsBlock
                                         failure:(void (^)(NSError *error))failure;

@property (nonatomic, weak) id<ARFairFavoritesNetworkModelDelegate> delegate;

@end
