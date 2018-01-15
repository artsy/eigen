#import "ArtsyAPI+Private.h"
#import "ArtsyAPI+CurrentUserFunctions.h"
#import "ARUserManager.h"
#import "ARRouter.h"
#import "User.h"
#import "LotStanding.h"
#import "Bidder.h"

@implementation ArtsyAPI (CurrentUserFunctions)

+ (void)updateCurrentUserProperty:(NSString *)property toValue:(id)value success:(void (^)(User *user))success failure:(void (^)(NSError *error))failure
{
    NSParameterAssert(value);

    NSDictionary *params = @{property : value};
    NSURLRequest *request = [ARRouter newUserEditRequestWithParams:params];

    [self getRequest:request parseIntoAClass:[User class] success:success failure:failure];
}

+ (void)getCurrentUserBiddersForSale:(NSString *)saleID success:(void (^)(NSArray<Bidder *> *))success failure:(void (^)(NSError *error))failure
{
    if ([[ARUserManager sharedManager] currentUser] == nil) {
        success(@[]);
        return;
    }

    NSURLRequest *request = [ARRouter biddersRequestForSale:saleID];
    [self getRequest:request parseIntoAnArrayOfClass:[Bidder class] success:success failure:failure];
}

+ (void)getCurrentUserLotStandingsForSale:(NSString *)saleID success:(void (^)(NSArray<LotStanding *> *))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter lotStandingsRequestForSaleID:saleID];
    [self getRequest:request parseIntoAnArrayOfClass:[LotStanding class] success:success failure:failure];
}

+ (void)getCurrentUserTotalUnreadMessagesCount:(void (^)(NSInteger))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newTotalUnreadMessagesCountRequest];
    [self performGraphQLRequest:request success:^(id json) {
        NSString *countString = json[@"data"][@"me"][@"conversations"][@"totalUnreadCount"];
        
        if (!countString) {
            NSLog(@"Failure fetching GraphQL data: %@", json);
            if (failure) {
                failure([NSError errorWithDomain:@"JSON parsing" code:0 userInfo:json]);
            }
            return;
        }
        
        success([countString integerValue]);
    } failure:failure];
}

@end
