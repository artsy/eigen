#import "ARStubbedBrowseNetworkModel.h"
#import "ARBrowseNetworkModel.h"

@implementation ARStubbedBrowseNetworkModel

@synthesize links = _links;

- (void)getBrowseFeaturedLinks:(void (^)(NSArray *links))success failure:(void (^)(NSError *error))failure;
{
    success(self.links);
}

@end
