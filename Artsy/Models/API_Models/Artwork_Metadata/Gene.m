#import "ArtsyAPI+Artworks.h"
#import "ArtsyAPI+Following.h"
#import "ArtsyAPI+Genes.h"
#import "ARSpotlight.h"
#import "User.h"
#import "Gene.h"
#import <UIKit/UIScreen.h>


@interface Gene () {
    BOOL _isFollowed;
}

@property (nonatomic, copy, readonly) NSString *urlFormatString;
@end


@implementation Gene

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"geneID" : @"id",
        @"uuid" : @"_id",
        @"name" : @"name",
        @"geneDescription" : @"description",
        @"artistCount" : @"counts.artists",
        @"artworkCount" : @"counts.artworks",
        @"followCount" : @"follow_count",
        @"urlFormatString" : @"image_url",
        @"urlFormats" : @"image_versions"
    };
}

- (NSString *)baseImageURL
{
    return self.urlFormatString;
}

- (NSURL *)largeImageURL
{
    return [NSURL URLWithString:[self.urlFormatString stringByReplacingOccurrencesOfString:@":version" withString:@"square500"]];
}

- (NSURL *)smallImageURL
{
    return [NSURL URLWithString:[self.urlFormatString stringByReplacingOccurrencesOfString:@":version" withString:@"thumb"]];
}

- (NSURL *)onboardingImageURL
{
    NSInteger heightAndWidth = 50 * [[UIScreen mainScreen] scale];
    NSString *geminiStringURL = @"https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=%ld&height=%ld&quality=85&src=%@";
    NSString *completeURL = [NSString stringWithFormat:geminiStringURL, heightAndWidth, heightAndWidth, self.urlFormatString];

    return [NSURL URLWithString:completeURL];
}

- (instancetype)initWithGeneID:(NSString *)geneID
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _geneID = geneID;

    return self;
}

- (void)updateGene:(void (^)(void))success
{
    __weak typeof(self) wself = self;
    [ArtsyAPI getGeneForGeneID:self.geneID success:^(id gene) {
        __strong typeof (wself) sself = wself;
        [sself mergeValuesForKeysFromModel:gene];
        success();
    } failure:^(NSError *error) {
        success();
    }];
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
    [ArtsyAPI setFavoriteStatus:state forGene:self success:^(id response) {
        __strong typeof (wself) sself = wself;
        sself.followed = state;
        [ARSpotlight addToSpotlightIndex:state entity:self];
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

- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure
{
    __weak typeof(self) wself = self;
    [ArtsyAPI checkFavoriteStatusForGene:self success:^(BOOL result) {
        __strong typeof (wself) sself = wself;
        sself.followed = result;
        success(result ? ARHeartStatusYes : ARHeartStatusNo);
    } failure:failure];
}

- (AFHTTPRequestOperation *)getArtworksAtPage:(NSInteger)page success:(void (^)(NSArray *artworks))success
{
    return [ArtsyAPI getArtworksForGene:self atPage:page success:^(NSArray *artworks) {
        success(artworks);

    } failure:^(NSError *error) {
        success(nil);
    }];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        Gene *gene = object;
        return [gene.geneID isEqualToString:self.geneID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.geneID.hash;
}

#pragma mark ShareableObject

- (NSString *)publicArtsyID;
{
    return self.geneID;
}

- (NSString *)publicArtsyPath
{
    return [NSString stringWithFormat:@"/gene/%@", self.geneID];
}

#pragma mark - ARSpotlightMetadataProvider

- (NSString *)spotlightDescription;
{
    return self.geneDescription.length > 0 ? nil : @"Category on Artsy";
}

- (NSString *)spotlightMarkdownDescription;
{
    return self.geneDescription;
}

- (NSURL *)spotlightThumbnailURL;
{
    return self.smallImageURL;
}

@end
