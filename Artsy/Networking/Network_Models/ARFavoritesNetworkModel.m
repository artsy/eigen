#import "ARFavoritesNetworkModel.h"
#import <AFNetworking/AFNetworking.h>


@interface ARFavoritesNetworkModel ()
@property (readwrite, nonatomic, assign) BOOL allDownloaded;
@property (atomic, weak) AFHTTPRequestOperation *currentRequest;
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
    if (self.currentRequest) {
        return;
    }

    __weak typeof(self) wself = self;

    self.currentRequest = [self requestOperationAtPage:self.currentPage withSuccess:^(NSArray *items) {
        __strong typeof (wself) sself = wself;
        if (!sself) { return; }

        sself.currentPage++;

        if (items.count == 0) {
            sself.allDownloaded = YES;
        }

        if(success) success(items);

    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        if (!sself) { return; }

        sself.allDownloaded = YES;

        if(success) success(@[]);
    }];
}

- (AFHTTPRequestOperation *)requestOperationAtPage:(NSInteger)page withSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    [NSException raise:NSInvalidArgumentException format:@"NSObject %@[%@]: selector not recognized - use a subclass: ", NSStringFromClass([self class]), NSStringFromSelector(_cmd)];
    return nil;
}

@end
