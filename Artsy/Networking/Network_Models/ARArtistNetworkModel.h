/// The API for the ArtistViewController

@protocol ARArtistNetworkModelable <NSObject>

- (void)getArtistInfoWithSuccess:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure;

- (void)getArtistArtworksAtPage:(NSInteger)page params:(NSDictionary *)params success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

- (void)setFavoriteStatus:(BOOL)status success:(void (^)(id response))success failure:(void (^)(NSError *error))failure;

- (AFJSONRequestOperation *)getRelatedArtists:(void (^)(NSArray *artists))success;

- (AFJSONRequestOperation *)getRelatedPosts:(void (^)(NSArray *posts))success;

@end

/// The Network Model for the ArtistViewController

@interface ARArtistNetworkModel : NSObject <ARArtistNetworkModelable>

- (instancetype)initWithArtist:(Artist *)artist;
@property (readonly, nonatomic, strong) Artist *artist;

@end

/// The Stubbed Network Model for the ArtistViewController

@interface ARStubbedArtistNetworkModel : NSObject <ARArtistNetworkModelable>

- (instancetype)initWithArtist:(Artist *)artist;
@property (readonly, nonatomic, strong) Artist *artist;

@property (readwrite, nonatomic, strong) Artist *artistForArtistInfo;
@property (readwrite, nonatomic, copy) NSArray *artworksForArtworksAtPage;
@property (readwrite, nonatomic, copy) NSArray *forSaleArtworksForArtworksAtPage;

@end
