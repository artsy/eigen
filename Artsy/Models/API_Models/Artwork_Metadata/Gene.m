

@interface Gene () {
    BOOL _isFollowed;
}

@property (nonatomic, copy, readonly) NSString *urlFormatString;
@end


@implementation Gene

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"geneID" : @"id",
        @"name" : @"name",
        @"geneDescription" : @"description",
        @"artistCount" : @"counts.artists",
        @"artworkCount" : @"counts.artworks",
        @"followCount" : @"follow_count",
        @"urlFormatString" : @"image_url",
        @"urlFormats" : @"image_versions"
    };
}

- (NSString *)baseImageURL
{
    return self.urlFormatString;
}

- (NSURL *)largeImageURL
{
    return [NSURL URLWithString:[self.urlFormatString stringByReplacingOccurrencesOfString:@":version" withString:@"square500"]];
}

- (NSURL *)smallImageURL
{
    return [NSURL URLWithString:[self.urlFormatString stringByReplacingOccurrencesOfString:@":version" withString:@"thumb"]];
}

- (instancetype)initWithGeneID:(NSString *)geneID
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _geneID = geneID;

    return self;
}

- (void)updateGene:(void (^)(void))success
{
    @weakify(self);
    [ArtsyAPI getGeneForGeneID:self.geneID success:^(id gene) {
        @strongify(self);
        [self mergeValuesForKeysFromModel:gene];
        success();
    } failure:^(NSError *error) {
        success();
    }];
}

- (void)setFollowed:(BOOL)isFollowed
{
    _isFollowed = isFollowed;
}

- (BOOL)isFollowed
{
    return _isFollowed;
}

- (void)followWithSuccess:(void (^)(id))success failure:(void (^)(NSError *))failure
{
    [self setFollowState:YES success:success failure:failure];
}

- (void)unfollowWithSuccess:(void (^)(id))success failure:(void (^)(NSError *))failure
{
    [self setFollowState:NO success:success failure:failure];
}

- (void)setFollowState:(BOOL)state success:(void (^)(id))success failure:(void (^)(NSError *))failure
{
    @weakify(self);
    [ArtsyAPI setFavoriteStatus:state forGene:self success:^(id response) {
        @strongify(self);
        self.followed = state;
        if (success) {
            success(response);
        }
    } failure:^(NSError *error) {
        @strongify(self);
        self.followed = !state;
        if (failure) {
            failure(error);
        }
    }];
}

- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure
{
    if ([User isTrialUser]) {
        success(ARHeartStatusNo);
        return;
    }

    @weakify(self);
    [ArtsyAPI checkFavoriteStatusForGene:self success:^(BOOL result) {
        @strongify(self);
        self.followed = result;
        success(result ? ARHeartStatusYes : ARHeartStatusNo);
    } failure:failure];
}

- (AFJSONRequestOperation *)getArtworksAtPage:(NSInteger)page success:(void (^)(NSArray *artworks))success
{
    return [ArtsyAPI getArtworksForGene:self atPage:page success:^(NSArray *artworks) {
        success(artworks);

    } failure:^(NSError *error) {
        success(nil);
    }];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        Gene *gene = object;
        return [gene.geneID isEqualToString:self.geneID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.geneID.hash;
}

#pragma mark ShareableObject

- (NSString *)publicArtsyPath
{
    return [NSString stringWithFormat:@"/gene/%@", self.geneID];
}

@end
