#import "ARRouter+RestAPI.h"
#import "ArtsyAPI+Private.h"


@implementation ArtsyAPI (Following)

+ (void)setFavoriteStatus:(BOOL)status
               forArtwork:(Artwork *)artwork
                  success:(void (^)(id response))success
                  failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newSetArtworkFavoriteRequestForArtwork:artwork status:status];
    [self performRequest:request success:success failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        if (failure) {
            failure(error);
        }
    }];
}

+ (void)checkFavoriteStatusForArtwork:(Artwork *)artwork
                              success:(void (^)(BOOL result))success
                              failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newCheckFavoriteStatusRequestForArtwork:artwork];
    [self performRequest:request success:^(NSArray *response) {
        if (success) {
            success([response count] > 0);
        }
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        if (response.statusCode == 404) {
            if (success) {
                success(NO);
            }
        } else if (failure) {
            failure(error);
        }
    }];
}

#pragma mark - Artist

+ (void)setFavoriteStatus:(BOOL)status
                forArtist:(Artist *)artist
                  success:(void (^)(id response))success
                  failure:(void (^)(NSError *error))failure
{
    if (status) {
        [self followArtist:artist success:success failure:failure];
    } else {
        [self unFollowArtist:artist success:success failure:failure];
    }
}

+ (void)followArtist:(Artist *)artist
             success:(void (^)(id response))success
             failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newFollowArtistRequest:artist];
    [self performRequest:request success:success failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        if (failure) {
            failure(error);
        }
    }];
}

+ (void)unFollowArtist:(Artist *)artist
               success:(void (^)(id response))success
               failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newUnfollowArtistRequest:artist];
    [self performRequest:request success:success failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        if (failure) {
            failure(error);
        }
    }];
}

+ (void)checkFavoriteStatusForArtist:(Artist *)artist
                             success:(void (^)(BOOL result))success
                             failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newFollowingRequestForArtist:artist];
    [self performRequest:request success:^(NSArray *response) {
        if (success) {
            success([response count] > 0);
        }
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        if (response.statusCode == 404) {
            if (success) {
                success(NO);
            }
        } else if (failure) {
            failure(error);
        }
    }];
}

#pragma mark - Genes

+ (void)setFavoriteStatus:(BOOL)status
                  forGene:(Gene *)gene
                  success:(void (^)(id response))success
                  failure:(void (^)(NSError *error))failure
{
    if (status) {
        [self followGene:gene success:success failure:failure];
    } else {
        [self unFollowGene:gene success:success failure:failure];
    }
}

+ (void)followGene:(Gene *)gene
           success:(void (^)(id response))success
           failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newFollowGeneRequest:gene];
    [self performRequest:request success:success failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        if (failure) {
            failure(error);
        }
    }];
}

+ (void)unFollowGene:(Gene *)gene success:(void (^)(id response))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newUnfollowGeneRequest:gene];
    [self performRequest:request success:success failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        if (failure) {
            failure(error);
        }
    }];
}

+ (void)checkFavoriteStatusForGene:(Gene *)gene success:(void (^)(BOOL result))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newFollowingRequestForGene:gene];
    [self performRequest:request success:^(NSArray *response) {
        if (success) {
            success([response count] > 0);
        }
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        if (response.statusCode == 404) {
            if (success) {
                success(NO);
            }
        } else if (failure) {
            failure(error);
        }
    }];
}

@end
