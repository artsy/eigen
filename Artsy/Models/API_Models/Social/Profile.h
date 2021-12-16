#import "ARFollowable.h"

#import <Mantle/Mantle.h>


/// A profile is a model that represents something
/// a user can log in to, like a User account or a Partner account.

@interface Profile : MTLModel <MTLJSONSerializing, ARFollowable>

@property (nonatomic, copy) NSString *profileID;

- (NSString *)avatarURLString;
- (instancetype)initWithProfileID:(NSString *)profileID;
- (void)updateProfile:(void (^)(void))success;

@end
