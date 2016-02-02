#import "ArtsyAPI+Private.h"
#import "ARRouter.h"
#import "Post.h"


@implementation ArtsyAPI (Posts)

+ (void)getPostForPostID:(NSString *)postID success:(void (^)(Post *post))success failure:(void (^)(NSError *error))failure
{
    NSParameterAssert(success);
    [self getRequest:[ARRouter newPostInfoRequestWithID:postID] parseIntoAClass:[Post class] success:success failure:failure];
}

@end
