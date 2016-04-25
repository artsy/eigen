#import "ARHeartStatus.h"

@protocol ARFollowable <NSObject>

@property (nonatomic, assign, getter=isFollowed) BOOL followed;
@property (nonatomic, strong, readonly) NSString *id;

- (void)followWithSuccess:(void (^)(id response))success failure:(void (^)(NSError *error))failure;
- (void)unfollowWithSuccess:(void (^)(id response))success failure:(void (^)(NSError *error))failure;
- (void)setFollowState:(BOOL)state success:(void (^)(id))success failure:(void (^)(NSError *))failure;
- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure;

@end
