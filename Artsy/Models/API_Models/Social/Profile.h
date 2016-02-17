#import "ARFollowable.h"

#import <Mantle/Mantle.h>

@protocol ProfileOwner;

/// A profile is a model that represents something
/// a user can log in to, like a User account or a Partner account.


@interface Profile : MTLModel <MTLJSONSerializing, ARFollowable>

@property (nonatomic, copy) NSString *profileID;
@property (nonatomic, copy) NSString *bio;
@property (nonatomic, strong) NSNumber *followCount;
@property (nonatomic, strong, readonly) NSObject<ProfileOwner> *profileOwner;

- (NSString *)iconURL;
- (NSString *)avatarURLString;
- (instancetype)initWithProfileID:(NSString *)profileID;
- (void)updateProfile:(void (^)(void))success;
- (NSString *)profileName;

@end
