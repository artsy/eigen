#import "ARFairNetworkModel.h"


@implementation ARFairNetworkModel

- (void)getFairInfo:(Fair *)fair success:(void (^)(Fair *))success failure:(void (^)(NSError *))failure
{
    [self getFairInfoWithID:fair.fairID success:^(Fair *newFair) {

        NSArray *tempMaps = fair.maps;
        [fair mergeValuesForKeysFromModel:newFair];
        fair.maps = tempMaps;

        success(fair);

    } failure:^(NSError *error) {


        failure(error);
    }];
}

- (void)getFairInfoWithID:(NSString *)fairID success:(void (^)(Fair *))success failure:(void (^)(NSError *))failure
{
    [ArtsyAPI getFairInfo:fairID success:success failure:failure];
}

- (void)getPostsForFair:(Fair *)fair success:(void (^)(ARFeedTimeline *))success
{
    ARFairOrganizerFeed *postsFeed = [[ARFairOrganizerFeed alloc] initWithFairOrganizer:fair.organizer];
    ARFeedTimeline *postsFeedTimeline = [[ARFeedTimeline alloc] initWithFeed:postsFeed];

    [postsFeedTimeline getNewItems:^{
        success(postsFeedTimeline);
    } failure:^(NSError *error) {
        success (postsFeedTimeline);
    }];
}

- (void)getOrderedSetsForFair:(Fair *)fair success:(void (^)(NSMutableDictionary *set))success failure:(void (^)(NSError *))failure
{
    [ArtsyAPI getOrderedSetsWithOwnerType:@"Fair" andID:fair.fairID success:success failure:failure];
}

- (void)getMapInfoForFair:(Fair *)fair success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
   @_weakify(fair);

    [ArtsyAPI getMapInfoForFair:fair success:^(NSArray *maps) {
        @_strongify(fair);
        if (!fair) { return; }
        fair.maps = maps;
        if (success) {
            success(maps);
        }
    } failure:failure];
}

- (void)getShowFeedItems:(ARFairShowFeed *)feed success:(void (^)(NSOrderedSet *))success failure:(void (^)(NSError *))failure
{
    [feed getFeedItemsWithCursor:feed.cursor success:success failure:failure];
}

@end


@interface ARFeedTimeline (Stubs)
@property (nonatomic, strong, readwrite) NSMutableOrderedSet *items;
@end


@implementation ARStubbedFairNetworkModel

- (void)getFairInfoWithID:(NSString *)fairID success:(void (^)(Fair *))success failure:(void (^)(NSError *))failure
{
    success(self.fair);
}

- (void)getPostsForFair:(Fair *)fair success:(void (^)(ARFeedTimeline *))success
{
    ARFairOrganizerFeed *postsFeed = [[ARFairOrganizerFeed alloc] initWithFairOrganizer:fair.organizer];
    ARFeedTimeline *postsFeedTimeline = [[ARFeedTimeline alloc] initWithFeed:postsFeed];

    if (self.postFeedItems) {
        postsFeedTimeline.items = [NSMutableOrderedSet orderedSetWithArray:self.postFeedItems];
    }
    success(postsFeedTimeline);
}

- (void)getOrderedSetsForFair:(Fair *)fair success:(void (^)(NSMutableDictionary *sets))success failure:(void (^)(NSError *))failure
{
    if (self.orderedSets) {
        NSMutableDictionary *orderedSetsByKey = [[NSMutableDictionary alloc] init];
        for (OrderedSet *orderedSet in self.orderedSets) {
            NSArray *sets = orderedSetsByKey[orderedSet.key] ?: @[];
            orderedSetsByKey[orderedSet.key] = [sets arrayByAddingObject:orderedSet];
        }

        success(orderedSetsByKey);
    }

    failure(nil);
}

- (void)getMapInfoForFair:(Fair *)fair success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    if (self.maps) {
        fair.maps = self.maps;
        success(fair.maps);
        return;
    }

    failure(nil);
}

- (void)getShowFeedItems:(ARFairShowFeed *)feed success:(void (^)(NSOrderedSet *))success failure:(void (^)(NSError *))failure
{
    if (self.showFeedItems) {
        success([NSOrderedSet orderedSetWithArray:self.showFeedItems]);
        return;
    }

    failure(nil);
}


@end
