#import "ARFileUtils.h"
#import "ARRouter.h"
#import "ArtsyAPI+OrderedSets.h"
#import "ArtsyAPI+Private.h"
#import "ARDispatchManager.h"

#import "AFHTTPRequestOperation+JSON.h"

@implementation ArtsyAPI (Feed)

+ (void)getFeedResultsForMainFeedWithCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure
{
    NSInteger pageSize = (cursor) ? 5 : 10;
    NSURLRequest *request = [ARRouter newFeedRequestWithCursor:cursor pageSize:pageSize];
    [self _getFeedWithURLRequest:request cursor:cursor success:success failure:failure];
}

+ (void)getFeedResultsForProfile:(Profile *)profile withCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure
{
    NSInteger pageSize = (cursor) ? 5 : 10;
    NSURLRequest *request = [ARRouter newPostsRequestForProfile:profile WithCursor:cursor pageSize:pageSize];
    [self _getFeedWithURLRequest:request cursor:cursor success:success failure:failure];
}

+ (void)getFeedResultsForFairOrganizer:(FairOrganizer *)fairOrganizer withCursor:(NSString *)cursor success:(void (^)(id))success failure:(void (^)(NSError *))failure
{
    NSInteger pageSize = (cursor) ? 5 : 10;
    NSURLRequest *request = [ARRouter newPostsRequestForFairOrganizer:fairOrganizer WithCursor:cursor pageSize:pageSize];
    [self _getFeedWithURLRequest:request cursor:cursor success:success failure:failure];
}

+ (void)getFeedResultsForShowsWithCursor:(NSString *)cursor pageSize:(NSInteger)pageSize success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newShowFeedRequestWithCursor:cursor pageSize:pageSize];
    [self _getFeedWithURLRequest:request cursor:cursor success:success failure:failure];
}

+ (void)getFeedResultsForFairShows:(Fair *)fair withCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure
{
    return [self getFeedResultsForFairShows:fair partnerID:nil withCursor:cursor success:success failure:failure];
}

+ (void)getFeedResultsForFairShows:(Fair *)fair partnerID:(NSString *)partnerID withCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newFairShowFeedRequestWithFair:fair partnerID:partnerID cursor:cursor pageSize:15];
    [self _getFeedWithURLRequest:request cursor:cursor success:success failure:failure];
}

+ (void)_getFeedWithURLRequest:(NSURLRequest *)request cursor:(NSString *)cursor
                       success:(void (^)(id JSON))success
                       failure:(void (^)(NSError *error))failure
{

    [self performRequest:request success:success failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        [ArtsyAPI handleXappTokenError:error];
        if (failure) {
            failure(error);
        }
    }];
}

+ (void)getFeaturedWorks:(void (^)(NSArray *works))success failure:(void (^)(NSError *error))failure
{
    [self getOrderedSetItemsWithKey:@"homepage:featured-artworks" success:success failure:failure];
}

@end
