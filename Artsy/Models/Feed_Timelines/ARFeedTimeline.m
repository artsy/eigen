#import "ARFeedTimeline.h"

#import "ARFeedItem.h"

@interface ARFeedTimeline ()
@property (nonatomic, strong) ARFeed *currentFeed;
@property (nonatomic, copy) NSString *currentlyLoadingCursor;
@property (nonatomic, strong) id representedObject;
@property (nonatomic, strong) NSMutableOrderedSet *items; // set enforces uniqueness of feed items
@property (nonatomic, assign) BOOL networking;
@end


@implementation ARFeedTimeline

- (instancetype)initWithFeed:(ARFeed *)feed
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _currentFeed = feed;
    _items = [[NSMutableOrderedSet alloc] init];

    return self;
}

- (void)removeAllItems
{
    [self.items removeAllObjects];
    self.currentlyLoadingCursor = nil;
}

// Should this have a "no more items" block? - ./

- (void)getNewItems:(void (^)(NSArray *items))success failure:(void (^)(NSError *error))failure
{
    __weak typeof (self) wself = self;
    [_currentFeed getFeedItemsWithCursor:nil success:^(NSOrderedSet *parsedItems) {
        __strong typeof (wself) sself = wself;

        NSIndexSet *indexSet = [NSIndexSet indexSetWithIndexesInRange:NSMakeRange(0, [parsedItems count])];
        NSArray *newItems = [parsedItems array];
        [sself.items insertObjects:newItems atIndexes:indexSet];
        if (success) {
            success(newItems);
        }
    } failure:failure];
}

- (void)getNextPage:(void (^)(NSArray *items))success failure:(void (^)(NSError *error))failure completion:(void (^)(void))completion
{
    if (self.networking) {
        return;
    }

    if (![self hasNext]) {
        if (completion) {
            completion();
        }
        return;
    }

    self.networking = true;
    self.currentlyLoadingCursor = self.currentFeed.cursor;

    __weak typeof (self) wself = self;
    void (^successBlock)(id) = ^(NSOrderedSet *parsedItems) {
        __strong typeof (wself) sself = wself;
        sself.networking = NO;
        if (parsedItems.count) {
            [sself.items addObjectsFromArray:[parsedItems array]];
            if (success) {
                success([parsedItems array]);
            }
        } else {
            if (completion) {
                completion();
            }
        }
    };

    void (^failureBlock)(NSError *) = ^(NSError *error) {
        __strong typeof (wself) sself = wself;
        sself.networking = NO;
        sself.currentlyLoadingCursor = nil;
        if (failure) {
            failure(error);
        }
    };

    [self.currentFeed getFeedItemsWithCursor:self.currentFeed.cursor success:successBlock failure:failureBlock];
}

#pragma mark - feed items datasource

- (NSInteger)numberOfItems
{
    return self.items.count;
}

- (ARFeedItem *)itemAtIndex:(NSInteger)index
{
    return self.items[index];
}

- (NSString *)description
{
    return [NSString stringWithFormat:@" ARFeed (%@ items)", @(self.items.count)];
}

- (BOOL)hasNext
{
    return (self.currentFeed.cursor != nil);
}

- (BOOL)isLoading
{
    return (self.currentlyLoadingCursor &&
            [self.currentlyLoadingCursor isEqualToString:self.currentFeed.cursor]);
}

@end
