#import "ArtsyAPI+Private.h"
#import "ArtsyAPI+CurrentUserFunctions.h"
#import "ARUserManager.h"
#import "ARRouter.h"
#import "User.h"
#import "Bidder.h"


@implementation ArtsyAPI (CurrentUserFunctions)

+ (void)updateCurrentUserProperty:(NSString *)property toValue:(id)value success:(void (^)(User *user))success failure:(void (^)(NSError *error))failure
{
    NSParameterAssert(value);

    NSDictionary *params = @{property : value};
    NSURLRequest *request = [ARRouter newUserEditRequestWithParams:params];

    [self getRequest:request parseIntoAClass:[User class] success:success failure:failure];
}

+ (void)getCurrentUserRegistrationStatusForSale:(NSString *)saleID success:(void (^)(ArtsyAPISaleRegistrationStatus status))success failure:(void (^)(NSError *error))failure
{
    if ([[ARUserManager sharedManager] currentUser]) {
        success(ArtsyAPISaleRegistrationStatusNotLoggedIn);
        return;
    }

    NSURLRequest *request = [ARRouter biddersRequestForSale:saleID];
    [self getRequest:request parseIntoAnArrayOfClass:[Bidder class] success:^(id bidders) {
        ArtsyAPISaleRegistrationStatus status = ArtsyAPISaleRegistrationStatusNotRegistered;

        if ([bidders count] > 0) {
            status = ArtsyAPISaleRegistrationStatusRegistered;
        }

        success(status);
    } failure:failure];
}

@end
