#import "Artwork.h"
#import "ArtsyAPI+Private.h"
#import "ARRouter.h"
#import "Fair.h"
#import "Follow.h"
#import "PartnerShow.h"


@implementation ArtsyAPI (Fairs)

+ (void)getProfileFollowsForFair:(Fair *)fair success:(void (^)(NSArray *profiles))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newFollowingProfilesRequestWithFair:fair];
    [self getRequest:request parseIntoAnArrayOfClass:Follow.class success:success failure:failure];
}

@end
