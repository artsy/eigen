@interface ARArtistNetworkModel : NSObject

- (instancetype)initWithArtist:(Artist *)artist;
@property (readonly, nonatomic, strong) Artist * artist;

- (void)getArtistInfoWithSuccess:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure;

- (void)getArtistArtworksAtPage:(NSInteger)page params:(NSDictionary *)params success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

- (void)setFavoriteStatus:(BOOL)status success:(void (^)(id response))success failure:(void (^)(NSError *error))failure;

@end
