#import "ARFavoritesNetworkModel.h"


@interface ARFavoritesNetworkModel ()
@property (readwrite, nonatomic, assign) BOOL downloadLock;
@property (readwrite, nonatomic, assign) NSInteger currentPage;
@end


@implementation ARFavoritesNetworkModel

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }
    _currentPage = 1;
    return self;
}

- (void)getFavorites:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    if (self.downloadLock) {
        return;
    }

    _downloadLock = YES;
    @weakify(self);

    [self performNetworkRequestAtPage:self.currentPage withSuccess:^(NSArray *items) {
        @strongify(self);
        if (!self) { return; }

        self.currentPage++;
        self.downloadLock = NO;

        if (items.count == 0) {
            self->_allDownloaded = YES;
        }

        if(success) success(items);

    } failure:^(NSError *error) {
        @strongify(self);
        if (!self) { return; }

        self->_allDownloaded = YES;

        self.downloadLock = NO;

        if(success) success(@[]);
    }];
}

- (void)performNetworkRequestAtPage:(NSInteger)page withSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    [NSException raise:NSInvalidArgumentException format:@"NSObject %@[%@]: selector not recognized - use a subclass: ", NSStringFromClass([self class]), NSStringFromSelector(_cmd)];
}

@end
