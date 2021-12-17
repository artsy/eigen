#import "User.h"

#import "ARMacros.h"
#import "ARUserManager.h"
#import "ArtsyAPI+Profiles.h"
#import "Profile.h"


@interface User ()
@property (nonatomic, copy, readonly) NSString *defaultProfileID;
@end


@implementation User

+ (User *)currentUser
{
    return [[ARUserManager sharedManager] currentUser];
}

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(User.new, userID) : @"id",
        ar_keypath(User.new, email) : @"email",
        ar_keypath(User.new, defaultProfileID) : @"default_profile_id",
        ar_keypath(User.new, identityVerified) : @"identity_verified",
    };
}

#pragma mark Model Upgrades

+ (NSUInteger)modelVersion
{
    return 1;
}

- (id)decodeValueForKey:(NSString *)key withCoder:(NSCoder *)coder modelVersion:(NSUInteger)fromVersion
{
    if (fromVersion == 0) {
        if ([key isEqual:@"userID"]) {
            return [coder decodeObjectForKey:@"userId"] ?: [coder decodeObjectForKey:@"userID"];
        } else if ([key isEqual:@"defaultProfileID"]) {
            return [coder decodeObjectForKey:@"defaultProfileId"] ?: [coder decodeObjectForKey:@"defaultProfileID"];
        }
    }

    return [super decodeValueForKey:key withCoder:coder modelVersion:fromVersion];
}

+ (NSValueTransformer *)receiveFollowArtistsEmailTransformer
{
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

+ (NSValueTransformer *)receiveWeeklyEmailTransformer
{
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

- (void)updateProfile:(void (^)(void))success
{
    if (!_profile) _profile = [[Profile alloc] initWithProfileID:_defaultProfileID];

    [self.profile updateProfile:^{
        success();
    }];
}

- (void)setNilValueForKey:(NSString *)key
{
    if ([key isEqualToString:@"priceRange"]) {
        [self setValue:@"-1" forKey:key];
    } else {
        [super setNilValueForKey:key];
    }
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        User *user = object;
        return [user.userID isEqualToString:self.userID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.userID.hash;
}

@end
