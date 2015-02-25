@interface Profile (){
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
        @"profileID"         : @"id",
        @"ownerJSON"         : @"owner",
        @"ownerClassString"  : @"owner_type",
        @"followCount"       : @"follow_count",
        @"iconVersion"       : @"default_icon_version",
        @"iconURLs"          : @"icon.image_urls",
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

- (void)updateProfile:(void(^)(void))success
{
    @weakify(self);

    if (self.profileID) {
        [ArtsyAPI getProfileForProfileID:self.profileID success:^(Profile *profile) {
            @strongify(self);

            [self mergeValuesForKeysFromModel:profile];
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
    NSString *iconURL = nil;
    if (self.iconURLs.count > 0){
        if (self.iconVersion && [self.iconURLs objectForKey:self.iconVersion]) {
            iconURL  = [self.iconURLs objectForKey:self.iconVersion];
        } else {
            NSArray *values = [self.iconURLs allValues];
            iconURL = [values objectAtIndex:0];;
        }
        return iconURL;
    } else {
        return nil;
    }
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"Profile %@ - (%@)", _profileID, self.profileName];
}

- (BOOL)isEqual:(id)object
{
    if([object isKindOfClass:[self class]]) {
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
    if (!self) { return nil; }

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
    if(state){
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
