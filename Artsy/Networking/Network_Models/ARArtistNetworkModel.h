#import "ARHeartStatus.h"

@class Artist;

/// The API for the ArtistViewController

@protocol ARArtistNetworkModelable <NSObject>

- (void)getArtistInfoWithSuccess:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure;

- (void)getArtistArtworksAtPage:(NSInteger)page params:(NSDictionary *)params success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

- (void)setFavoriteStatus:(BOOL)status success:(void (^)(id response))success failure:(void (^)(NSError *error))failure;

- (void)getRelatedArtists:(void (^)(NSArray *artists))success;

- (void)getRelatedPosts:(void (^)(NSArray *posts))success;

- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure;

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
