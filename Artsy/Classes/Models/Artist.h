#import "MTLModel.h"
#import "ARFollowable.h"
#import "ARShareableObject.h"
#import "ARHasImageBaseURL.h"

@interface Artist : MTLModel <MTLJSONSerializing, ARFollowable, ARShareableObject, ARHasImageBaseURL>

@property (readonly, nonatomic, copy) NSString *artistID;
@property (readonly, nonatomic, copy) NSString *name;
@property (readonly, nonatomic, copy) NSString *years;
@property (readonly, nonatomic, copy) NSString *nationality;
@property (readonly, nonatomic, copy) NSString *blurb;
@property (readonly, nonatomic, copy) NSNumber *publishedArtworksCount;
@property (readonly, nonatomic, copy) NSNumber *forSaleArtworksCount;

- (instancetype)initWithArtistID:(NSString *)artistID;

- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure;
- (void)getArtworksAtPage:(NSInteger)page andParams:(NSDictionary *)params success:(void (^)(NSArray *artworks))success;

- (AFJSONRequestOperation *)getRelatedPosts:(void (^)(NSArray *posts))success;
- (AFJSONRequestOperation *)getRelatedArtists:(void (^)(NSArray *artists))success;

- (NSURL *)smallImageURL;

- (NSString *)publicURL;
@end
