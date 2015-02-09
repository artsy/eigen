#import <Foundation/Foundation.h>

@class ARFairFavoritesNetworkModel;

@protocol ARFairFavoritesNetworkModelDelegate <NSObject>

-(void)fairFavoritesNetworkModel:(ARFairFavoritesNetworkModel *)fairFavoritesNetworkModel shouldPresentViewController:(UIViewController *)viewController;

@end

@interface ARFairFavoritesNetworkModel : NSObject

- (void)getFavoritesForNavigationsButtonsForFair:(Fair *)fair
                                         artwork:(void (^)(NSArray *artworks))work
                                      exhibitors:(void (^)(NSArray *exhibitorsArray))exhibitors
                                         artists:(void (^)(NSArray *artistsArray))artists
                                         failure:(void (^)(NSError *error))failure;

@property (readonly, nonatomic, assign) BOOL isDownloading;

@property (nonatomic, weak) id<ARFairFavoritesNetworkModelDelegate> delegate;

@end
