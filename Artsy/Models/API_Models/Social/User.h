#import <Mantle/Mantle.h>

@class Profile;


@interface User : MTLModel <MTLJSONSerializing>

@property (nonatomic, strong) Profile *profile;

@property (nonatomic, copy, readonly) NSString *userID;
@property (nonatomic, copy, readonly) NSString *email;

@property (nonatomic, readonly) BOOL identityVerified;


+ (User *)currentUser;

- (void)updateProfile:(void (^)(void))success;

@end
