#import "ARBrowseNetworkModel.h"


@interface ARBrowseNetworkModel ()

@property (nonatomic, copy, readwrite) NSArray *links;

@end


@implementation ARBrowseNetworkModel

- (void)getBrowseFeaturedLinks:(void (^)(NSArray *links))success failure:(void (^)(NSError *error))failure;
{
    @_weakify(self);
    [ArtsyAPI getBrowseMenuFeedLinksWithSuccess:^(NSArray *links) {
        @_strongify(self);
        self.links = links;
        if (success) {
            success(self.links);
        }
    } failure:failure];
}

@end
