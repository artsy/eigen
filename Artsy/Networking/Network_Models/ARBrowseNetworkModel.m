#import "ARBrowseNetworkModel.h"

#import "ArtsyAPI+Browse.h"


@interface ARBrowseNetworkModel ()

@property (nonatomic, copy, readwrite) NSArray *links;

@end


@implementation ARBrowseNetworkModel

- (void)getBrowseFeaturedLinks:(void (^)(NSArray *links))success failure:(void (^)(NSError *error))failure;
{
    __weak typeof (self) wself = self;
    [ArtsyAPI getBrowseMenuFeedLinksWithSuccess:^(NSArray *links) {
        __strong typeof (wself) sself = wself;
        sself.links = links;
        if (success) {
            success(sself.links);
        }
    } failure:failure];
}

@end
