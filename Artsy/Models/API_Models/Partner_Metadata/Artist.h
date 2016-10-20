#import "ARFollowable.h"
#import "ARShareableObject.h"
#import "ARHasImageBaseURL.h"
#import "ARSpotlight.h"

#import <Mantle/Mantle.h>

@class AFHTTPRequestOperation;


@interface Artist : MTLModel <MTLJSONSerializing, ARFollowable, ARShareableObject, ARHasImageURLs, ARSpotlightMetadataProvider>

@property (readonly, nonatomic, copy) NSString *artistID;
@property (readonly, nonatomic, copy) NSString *uuid;
@property (readonly, nonatomic, copy) NSString *sortableID;
@property (readonly, nonatomic, copy) NSString *name;
@property (readonly, nonatomic, copy) NSString *years;
@property (readonly, nonatomic, copy) NSString *birthday;
@property (readonly, nonatomic, copy) NSString *nationality;
@property (readonly, nonatomic, copy) NSString *blurb;
@property (readonly, nonatomic, copy) NSNumber *publishedArtworksCount;
@property (readonly, nonatomic, copy) NSNumber *forSaleArtworksCount;


- (instancetype)initWithArtistID:(NSString *)artistID;

- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure;
- (AFHTTPRequestOperation *)getArtworksAtPage:(NSInteger)page andParams:(NSDictionary *)params success:(void (^)(NSArray *artworks))success;

- (AFHTTPRequestOperation *)getRelatedPosts:(void (^)(NSArray *posts))success;
- (AFHTTPRequestOperation *)getRelatedArtists:(void (^)(NSArray *artists))success;

- (NSURL *)squareImageURL;

- (NSString *)publicURL;
@end
