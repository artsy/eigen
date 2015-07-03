@protocol ARFairAwareObject;

@protocol FairArtistNeworkModel <NSObject>

- (AFJSONRequestOperation *)getShowsForArtistID:(NSString *)artistID inFairID:(NSString *)fairID success:(void (^)(NSArray *shows))success failure:(void (^)(NSError *error))failure;
- (void)getArtistForArtistID:(NSString *)artistID success:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure;

@end


@interface ARFairArtistViewController : UIViewController <ARFairAwareObject>

- (instancetype)initWithArtistID:(NSString *)artistID fair:(Fair *)fair NS_DESIGNATED_INITIALIZER;

@property (readonly, nonatomic, strong) Artist *artist;
@property (readonly, nonatomic, strong) Fair *fair;

- (BOOL)isFollowingArtist;

@end
