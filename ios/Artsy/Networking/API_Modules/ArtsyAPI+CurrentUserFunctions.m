#import "ArtsyAPI+Private.h"
#import "ArtsyAPI+CurrentUserFunctions.h"
#import "ARUserManager.h"
#import "ARRouter+RestAPI.h"
#import "User.h"
#import "Bidder.h"

@implementation ArtsyAPI (CurrentUserFunctions)

+ (void)getCurrentUserBiddersForSale:(NSString *)saleID success:(void (^)(NSArray<Bidder *> *))success failure:(void (^)(NSError *error))failure
{
    if ([[ARUserManager sharedManager] currentUser] == nil) {
        success(@[]);
        return;
    }

    NSURLRequest *request = [ARRouter biddersRequestForSale:saleID];
    [self getRequest:request parseIntoAnArrayOfClass:[Bidder class] success:success failure:failure];
}

@end
