#import "ARStubbedFavoritesNetworkModel.h"

@interface ARFavoritesNetworkModel (Private)
@property (readwrite, nonatomic, assign) BOOL allDownloaded;
@property (readwrite, nonatomic, assign) NSInteger currentPage;
@end

@interface ARStubbedFavoritesNetworkModel ()
@property (readwrite, nonatomic, copy) NSArray *favoritesStack;
@end

@implementation ARStubbedFavoritesNetworkModel

- (instancetype)initWithFavoritesStack:(NSArray *)favoritesStack;
{
    if ((self = [super init])) {
        _favoritesStack = favoritesStack;
    }
    return self;
}

- (void)getFavorites:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure;
{
    NSArray *page = [NSArray array];
    if (self.favoritesStack.count == 0) {
        self.allDownloaded = YES;
    } else {
        page = [self.favoritesStack firstObject];
        NSAssert([page isKindOfClass:NSArray.class], @"Should be a page of models");

        NSMutableArray *remainder = [self.favoritesStack mutableCopy];
        [remainder removeObjectAtIndex:0];
        self.favoritesStack = remainder;

        self.currentPage++;
    }
    success(page);
}

@end
