#import "ARFeed.h"

@class ARFeedItem;

/// The ARFeedTimeline will take an ARFeed and use it to generate
/// a timeline that makes it easy to deal with showing the data using
/// a tableview.


@interface ARFeedTimeline : NSObject

- (id)initWithFeed:(ARFeed *)feed;
- (ARFeedItem *)itemAtIndex:(NSInteger)index;
- (void)getNewItems:(void (^)(NSArray *items))success failure:(void (^)(NSError *error))failure;
- (void)getNextPage:(void (^)(NSArray *items))success failure:(void (^)(NSError *error))failure completion:(void (^)())completion;
- (void)removeAllItems;

@property (nonatomic, assign) BOOL hasNext;
@property (nonatomic, assign) NSInteger numberOfItems;
@property (nonatomic, assign, getter=isLoading) BOOL loading;
@end
