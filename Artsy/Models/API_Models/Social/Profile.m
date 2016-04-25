#import "Profile.h"

#import "ArtsyAPI+Profiles.h"
#import "Fair.h"
#import "FairOrganizer.h"
#import "Partner.h"
#import "ProfileOwner.h"
#import "User.h"
#import "ARMacros.h"

#import "MTLModel+JSON.h"
@import ObjectiveSugar;


@interface Profile () {
    BOOL _followed;
}

@property (nonatomic, copy) NSDictionary *iconURLs;
@property (nonatomic, copy) NSString *iconVersion;
@property (nonatomic, strong) NSString *ownerClassString;
@property (nonatomic, copy) NSDictionary *ownerJSON;
@end


@implementation Profile
@synthesize profileOwner = _profileOwner;


// Doing some silly hackery to create the profile's owner from both the `owner_type` keypath and the `owner` keypath
// until https://github.com/Mantle/Mantle/pull/270 is merged into master.
+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(Profile.new, profileID) : @"id",
        ar_keypath(Profile.new, ownerJSON) : @"owner",
        ar_keypath(Profile.new, ownerClassString) : @"owner_type",
        ar_keypath(Profile.new, followCount) : @"follow_count",
        ar_keypath(Profile.new, iconVersion) : @"default_icon_version",
        ar_keypath(Profile.new, iconURLs) : @"icon.image_urls",
    };
}

// Had problems converting the `owner_type` string into a Class with Mantle, so we'll do this instead.
- (Class)ownerClass
{
    NSString *className = self.ownerClassString;
    if ([className isEqualToString:@"User"]) {
        return [User class];
    } else if ([className isEqualToString:@"FairOrganizer"]) {
        return [FairOrganizer class];
    } else if ([className isEqualToString:@"Fair"]) {
        return [Fair class];
    } else if ([className isEqualToString:@"PartnerGallery"]) {
        return [Partner class];
    } else {
        return nil;
    }
}

- (NSObject<ProfileOwner> *)profileOwner
{
    // Create the owner by combining the information we got from `owner` and `owner_type` JSON.
    if (!_profileOwner) {
        _profileOwner = [[self ownerClass] modelWithJSON:self.ownerJSON];
    }
    return _profileOwner;
}

- (void)updateProfile:(void (^)(void))success
{
    __weak typeof(self) wself = self;

    if (self.profileID) {
        [ArtsyAPI getProfileForProfileID:self.profileID success:^(Profile *profile) {
            __strong typeof (wself) sself = wself;

            [sself mergeValuesForKeysFromModel:profile];
            success();

        } failure:^(NSError *error) {
            success();
        }];
    } else {
        success();
    }
}

- (NSString *)iconURL
{
    if (self.iconURLs.count > 0) {
        if (self.iconVersion && [self.iconURLs objectForKey:self.iconVersion]) {
            return [self.iconURLs objectForKey:self.iconVersion];
        } else {
            NSArray *values = [self.iconURLs allValues];
            return [values objectAtIndex:0];
        }
    }
    return nil;
}

- (NSString *)avatarURLString
{
    NSArray *desiredVersions = @[ @"square", @"square140", @"large" ];
    NSArray *possibleVersions = [desiredVersions intersectionWithArray:[self.iconURLs allKeys]];
    // If we can't find one of our desired values, default to the first available icon URL.
    return [self.iconURLs objectForKey:possibleVersions.firstObject] ?: [[self.iconURLs allValues] firstObject];
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"Profile %@ - (%@)", _profileID, self.profileName];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        Profile *profile = object;
        return [profile.profileID isEqualToString:_profileID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.profileID.hash;
}

- (instancetype)initWithProfileID:(NSString *)profileID
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _profileID = profileID;

    return self;
}

- (NSString *)profileName
{
    return [_profileOwner name];
}

- (void)setFollowed:(BOOL)followed
{
    _followed = followed;
}

- (BOOL)isFollowed
{
    return _followed;
}

- (NSString *)id
{
    return _profileID;
}

- (void)followWithSuccess:(void (^)(id response))success failure:(void (^)(NSError *error))failure
{
    [ArtsyAPI followProfile:self success:success failure:failure];
}

- (void)unfollowWithSuccess:(void (^)(id response))success failure:(void (^)(NSError *error))failure
{
    [ArtsyAPI unfollowProfile:self success:success failure:failure];
}

- (void)setFollowState:(BOOL)state success:(void (^)(id))success failure:(void (^)(NSError *))failure
{
    if (state) {
        [self followWithSuccess:success failure:failure];
    } else {
        [self unfollowWithSuccess:success failure:failure];
    }
}

- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure
{
    if ([User isTrialUser]) {
        success(ARHeartStatusNo);
        return;
    }

    [ArtsyAPI checkFollowProfile:self success:^(BOOL status) {
        success(status);
    } failure:failure];
}

@end
