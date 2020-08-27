#import <Foundation/Foundation.h>


@class ARFairShowFeed, ARFeedTimeline, Fair;


@interface ARFairNetworkModel : NSObject

- (void)getShowFeedItems:(ARFairShowFeed *)feed success:(void (^)(NSOrderedSet *orderedSet))success failure:(void (^)(NSError *error))failure;

- (void)getPostsForFair:(Fair *)fair success:(void (^)(ARFeedTimeline *feedTimeline))success;

- (void)getOrderedSetsForFair:(Fair *)fair success:(void (^)(NSMutableDictionary *orderedSets))success failure:(void (^)(NSError *error))failure;

@end


@interface ARStubbedFairNetworkModel : ARFairNetworkModel

@property (nonatomic, weak, readwrite) Fair *fair;
@property (nonatomic, strong, readwrite) NSArray *showFeedItems;
@property (nonatomic, strong, readwrite) NSArray *postFeedItems;
@property (nonatomic, strong, readwrite) NSArray *orderedSets;
@property (nonatomic, strong, readwrite) NSArray *maps;

@end
