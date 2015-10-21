#import <Foundation/Foundation.h>


@interface ARFavoritesNetworkModel : NSObject

@property (readonly, nonatomic, assign) BOOL allDownloaded;
@property (readwrite, nonatomic, assign) BOOL useSampleFavorites;

- (void)getFavorites:(void (^)(NSArray *genes))success failure:(void (^)(NSError *error))failure;

@end
