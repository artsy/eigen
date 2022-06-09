#import "Artist.h"

#import "ArtsyAPI+Following.h"
#import "ArtsyAPI+RelatedModels.h"
#import "ARNetworkConstants.h"
#import "User.h"


@interface Artist () {
    BOOL _isFollowed;
}
@end


@implementation Artist
@synthesize imageURLs;

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"artistID" : @"id",
        @"uuid" : @"_id",
        @"name" : @"name",
        @"years" : @"years",
        @"birthday" : @"birthday",
        @"nationality" : @"nationality",
        @"blurb" : @"blurb",
        @"imageURLs" : @"image_urls",
        @"sortableID" : @"sortable_id"
    };
}

- (NSURL *)squareImageURL
{
    return [self imageURLWithFormatName:@"square"];
}

- (NSURL *)imageURLWithFormatName:(NSString *)formatName
{
    return [NSURL URLWithString:[self.imageURLs objectForKey:formatName]];
}

- (instancetype)initWithArtistID:(NSString *)artistID
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _artistID = artistID;

    return self;
}

- (void)setFollowed:(BOOL)isFollowed
{
    _isFollowed = isFollowed;
}

- (BOOL)isFollowed
{
    return _isFollowed;
}

- (void)followWithSuccess:(void (^)(id))success failure:(void (^)(NSError *))failure
{
    [self setFollowState:YES success:success failure:failure];
}

- (void)unfollowWithSuccess:(void (^)(id))success failure:(void (^)(NSError *))failure
{
    [self setFollowState:NO success:success failure:failure];
}

- (void)setFollowState:(BOOL)state success:(void (^)(id))success failure:(void (^)(NSError *))failure
{
    __weak typeof(self) wself = self;
    [ArtsyAPI setFavoriteStatus:state forArtist:self success:^(id response) {
        __strong typeof (wself) sself = wself;
        sself.followed = state;
        if (success) {
            success(response);
        }
    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        sself.followed = !state;
        if (failure) {
            failure(error);
        }
    }];
}

- (BOOL)isEqual:(id)object
{
    if (![object isKindOfClass:[Artist class]]) {
        return NO;
    }
    Artist *other = (Artist *)object;
    return [self.artistID isEqualToString:other.artistID];
}

- (NSUInteger)hash
{
    return self.artistID.hash;
}

#pragma mark ShareableObject

- (NSString *)publicArtsyID;
{
    return self.artistID;
}

- (NSString *)publicArtsyPath
{
    return [NSString stringWithFormat:@"/artist/%@", self.artistID];
}

@end
