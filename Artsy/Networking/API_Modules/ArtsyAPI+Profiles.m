#import "ArtsyAPI+ErrorHandlers.h"
#import "ArtsyAPI+Private.h"
#import "ARRouter.h"


@implementation ArtsyAPI (Profiles)

+ (void)getProfileForProfileID:(NSString *)profileID success:(void (^)(Profile *profile))success failure:(void (^)(NSError *error))failure
{
    NSParameterAssert(success);
    [self getRequest:[ARRouter newProfileInfoRequestWithID:profileID] parseIntoAClass:[Profile class] success:success failure:failure];
}

+ (void)checkFollowProfile:(Profile *)profile success:(void (^)(BOOL doesFollow))success failure:(void (^)(NSError *error))failure
{
    NSParameterAssert(success);
    NSURLRequest *headRequest = [ARRouter newCheckFollowingProfileHeadRequest:profile.profileID];

    [self performRequest:headRequest success:^(NSArray *response) {
        if (success) {
            success([response count] > 0);
        }
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        if (response.statusCode == 404) {
            if (success) {
                success(NO);
            }
        } else failure(error);
    }];
}

+ (void)followProfile:(Profile *)profile success:(void (^)(Profile *returnedProfile))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newMyFollowProfileRequest:profile.profileID];

    [self getRequest:request parseIntoAClass:[Profile class] success:^(Profile *returnedProfile) {
        if (success) {
            success(returnedProfile);
        }

    } failure:^(NSError *error) {

        ARErrorLog(@"Could not Follow Profile: %@", error.localizedDescription);
        if (failure) { failure(error); }
    }];
}

+ (void)unfollowProfile:(Profile *)profile success:(void (^)(Profile *returnedProfile))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newMyUnfollowProfileRequest:[profile profileID]];

    [self getRequest:request parseIntoAClass:[Profile class] success:^(Profile *returnedProfile) {
        if (success) {
            success(returnedProfile);
        }
    } failure:^(NSError *error) {
        [ArtsyAPI handleHTTPError:error statusCode:404 errorMessage:@"Profile Not Followed" success:^(NSError *error) {
            if (success) {
                success(profile);
            }
        } failure:^(NSError *error) {
            ARErrorLog(@"Could not Unfollow Profile: %@", error.localizedDescription);
            if (failure) {
                failure(error);
            }
        }];
    }];
}

@end
