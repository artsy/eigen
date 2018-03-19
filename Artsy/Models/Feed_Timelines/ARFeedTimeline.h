#import "ARFeed.h"

@class ARFeedItem;

/// The ARFeedTimeline will take an ARFeed and use it to generate
/// a timeline that makes it easy to deal with showing the data using
/// a tableview.


@interface ARFeedTimeline : NSObject

- (instancetype)initWithFeed:(ARFeed *)feed;
- (ARFeedItem *)itemAtIndex:(NSInteger)index;

- (void)getNewItems:(void (^)(NSArray *items))success failure:(void (^)(NSError *error))failure;
- (void)getNextPage:(void (^)(NSArray *items))success failure:(void (^)(NSError *error))failure completion:(void (^)(void))completion;
- (void)removeAllItems;

@property (nonatomic, strong, readonly) NSMutableOrderedSet *items;
@property (nonatomic, assign, readonly) BOOL hasNext;
@property (nonatomic, assign, readonly) NSInteger numberOfItems;
@property (nonatomic, assign, readonly, getter=isLoading) BOOL loading;
@end
