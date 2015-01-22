@interface ArtsyAPI (Profiles)

+ (void)getProfileForProfileID:(NSString *)profileID success:(void (^)(Profile *profile))success failure:(void (^)(NSError *error))failure;

+ (void)checkFollowProfile:(Profile *)profile success:(void (^)(BOOL doesFollow))success failure:(void (^)(NSError *error))failure;

+ (void)followProfile:(Profile *)profile success:(void (^)(Profile *returnedProfile))success failure:(void (^)(NSError *error))failure;

+ (void)unfollowProfile:(Profile *)profile success:(void (^)(Profile *returnedProfile))success failure:(void (^)(NSError *error))failure;

@end
