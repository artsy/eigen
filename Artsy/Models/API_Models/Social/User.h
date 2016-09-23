#import <Mantle/Mantle.h>

@class Profile;


@interface User : MTLModel <MTLJSONSerializing>

typedef NS_ENUM(NSInteger, ARCollectorLevel) {
    ARCollectorLevelNo = 1,
    ARCollectorLevelInterested,
    ARCollectorLevelCollector
};

@property (nonatomic, strong) Profile *profile;

@property (nonatomic, copy, readonly) NSString *userID;
@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *email;
@property (nonatomic, copy, readonly) NSString *phone;

@property (nonatomic, copy, readonly) NSString *defaultProfileID;
@property (nonatomic, assign) ARCollectorLevel collectorLevel;
@property (nonatomic, copy) NSString *priceRange;

@property (nonatomic, readonly) BOOL receiveWeeklyEmail;
@property (nonatomic, readonly) BOOL receiveFollowArtistsEmail;
@property (nonatomic, readonly) BOOL receiveFollowArtistsEmailAll;
@property (nonatomic, readonly) BOOL receiveFollowUsersEmail;

+ (User *)currentUser;
+ (BOOL)isLocalTemporaryUser;

- (void)userFollowsProfile:(Profile *)profile success:(void (^)(BOOL doesFollow))success failure:(void (^)(NSError *error))failure;

- (void)setRemoteUpdateCollectorLevel:(enum ARCollectorLevel)collectorLevel success:(void (^)(User *user))success failure:(void (^)(NSError *error))failure;
- (void)setRemoteUpdatePriceRange:(NSInteger)maximumRange success:(void (^)(User *user))success failure:(void (^)(NSError *error))failure;

- (void)updateProfile:(void (^)(void))success;

@end
