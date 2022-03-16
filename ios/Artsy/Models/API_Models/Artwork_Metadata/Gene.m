#import "ArtsyAPI+Following.h"
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

- (instancetype)initWithGeneID:(NSString *)geneID
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _geneID = geneID;

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
    [ArtsyAPI setFavoriteStatus:state forGene:self success:^(id response) {
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

@end
