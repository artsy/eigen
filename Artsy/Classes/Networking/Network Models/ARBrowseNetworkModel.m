#import "ARBrowseNetworkModel.h"

@implementation ARBrowseNetworkModel

- (void)getBrowseFeaturedLinks:(void (^)(NSArray *links))success failure:(void (^)(NSError *error))failure;
{
    @weakify (self);
    [ArtsyAPI getBrowseMenuFeedLinksWithSuccess:^(NSArray *links) {
        @strongify(self);
        self->_links = links;
        success(self.links);
    } failure:failure];
}

@end