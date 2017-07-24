#import "ARFavoritesNetworkModel.h"
#import <AFNetworking/AFNetworking.h>
#import "ARFavoritesNetworkModel+Private.h"


@implementation ARFavoritesNetworkModel

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }
    self->_currentPage = 1;
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
