#import "ARStandardDateFormatter.h"
#import "NSDate+DateRange.h"
#import "ARPartnerShowFeedItem.h"
#import "ARFileUtils.h"

@interface Fair (){
    ARFairShowFeed *_showsFeed;
    ARFairOrganizerFeed *_postsFeed;
    ARFeedTimeline *_postsFeedTimeline;
    NSMutableSet *_showsLoadedFromArchive;
}

@property (readwrite, nonatomic, strong) KSDeferred *showsDeferred;
@property (nonatomic, copy) NSArray *maps;
// Note: *must* be strong and not copy, because copy will make a non-mutable copy.
@property (nonatomic, strong) NSMutableSet *shows;
@property (nonatomic, copy) NSDictionary *imageURLs;

@end

@implementation Fair

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @keypath(Fair.new, name) : @"name",
        @keypath(Fair.new, fairID) : @"id",
        @keypath(Fair.new, organizer) : @"organizer",
        @keypath(Fair.new, startDate): @"start_at",
        @keypath(Fair.new, endDate) : @"end_at",
        @keypath(Fair.new, city) : @"location.city",
        @keypath(Fair.new, state) : @"location.state",
        @keypath(Fair.new, imageURLs): @"image_urls",
        @keypath(Fair.new, partnersCount) : @"partners_count",

        // Hide these from Mantle
        //
        // This can be removed in Mantle 2.0 which won't have implicit mapping
        @keypath(Fair.new, showsDeferred) : NSNull.null,
        @keypath(Fair.new, maps) : NSNull.null,
    };
}

+ (NSValueTransformer *)startDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)endDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)organizerJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[FairOrganizer class]];
}

- (NSString *)ausstellungsdauer
{
    return [self.startDate ausstellungsdauerToDate:self.endDate];
}

- (void)getPosts:(void (^)(ARFeedTimeline *feedTimeline))success
{
    _postsFeed = [[ARFairOrganizerFeed alloc] initWithFairOrganizer:[self organizer]];
    _postsFeedTimeline = [[ARFeedTimeline alloc] initWithFeed:_postsFeed];

    __weak ARFeedTimeline *weakTimeline = _postsFeedTimeline;
    [_postsFeedTimeline getNewItems:^{
        success(weakTimeline);
    } failure:^(NSError *error) {
        // TODO: don't swallow error
        success(weakTimeline);
    }];
}

- (instancetype)initWithFairID:(NSString *)fairID
{
    self = [super init];
    if (!self) { return nil; }

    _fairID = fairID;

    return self;
}

- (void)updateFair:(void(^)(void))success
{
    @weakify(self);

    [ArtsyAPI getFairInfo:self.fairID success:^(id fair) {
        @strongify(self);

        NSArray *tempMaps = self.maps;
        [self mergeValuesForKeysFromModel:fair];
        self.maps = tempMaps;

        success();

    } failure:^(NSError *error) {
        success();
    }];
}

- (void)downloadShows
{
    _showsFeed = [[ARFairShowFeed alloc] initWithFair:self];

    @weakify(self);

    NSString *path = self.pathForLocalShowStorage;

    ar_dispatch_async(^{
        NSMutableSet *shows = [[NSKeyedUnarchiver unarchiveObjectWithFile:path] mutableCopy];

        ar_dispatch_main_queue(^{
            @strongify(self);
            if (!self) { return; }

            [self willChangeValueForKey:@keypath(Fair.new, shows)];
            self->_showsLoadedFromArchive = shows ? [NSMutableSet setWithSet:shows] : nil;
            self.shows = shows ?: [NSMutableSet set];
            [self didChangeValueForKey:@keypath(Fair.new, shows)];

            // download once an hour at the most
            NSError *error = nil;
            NSDictionary *attributes = [[NSFileManager defaultManager] attributesOfItemAtPath:path error:&error];
            NSTimeInterval distanceBetweenDatesSeconds = error ? -1 : [[NSDate date] timeIntervalSinceDate:[attributes fileModificationDate]];
            if (distanceBetweenDatesSeconds < 0 || distanceBetweenDatesSeconds / 3600.f > 1) {
                [self downloadPastShowSet];
            }
        });
    });
}

+ (BOOL)automaticallyNotifiesObserversForKey:(NSString *)key
{
    if ([key isEqualToString:@keypath(Fair.new, shows)]) {
        return NO;
    }

    return [super automaticallyNotifiesObserversForKey:key];
}

// TODO: Could the show downloading etc move into it's own class on fair?

- (void)downloadPastShowSet
{
    @weakify(self);

    [_showsFeed getFeedItemsWithCursor:_showsFeed.cursor success:^(NSOrderedSet *parsed) {

        @strongify(self);
        if(parsed.count > 0) {
            [self addFeedItemsToShows:parsed];
            [self downloadPastShowSet];
        } else {
            [self finishedDownloadingShows];
        }

    } failure:^(NSError *error) {

        @strongify(self);
        NSLog(@"failed to get shows %@", error.localizedDescription);
        [self performSelector:@selector(downloadPastShowSet) withObject:nil afterDelay:0.5];
    }];
}

- (NSString *)pathForLocalShowStorage
{
    return [ARFileUtils cachesPathWithFolder:@"Fairs" filename:NSStringWithFormat(@"%@.showdata", self.fairID)];
}

- (void)finishedDownloadingShows
{
    if (_showsLoadedFromArchive && _showsLoadedFromArchive.count > 0) {
        [self willChangeValueForKey:@keypath(Fair.new, shows)];
        // remove any shows that were loaded from archive, but not downloaded
        [(NSMutableSet *)self.shows minusSet:_showsLoadedFromArchive];
        [self didChangeValueForKey:@keypath(Fair.new, shows)];
    }

    if(!ARIsRunningInDemoMode) {
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0), ^{
            if(![NSKeyedArchiver archiveRootObject:self.shows toFile:self.pathForLocalShowStorage]){
                ARErrorLog(@"Issue saving show data for fair %@", self.fairID);
            }
        });
    }
}

- (void)addFeedItemsToShows:(NSOrderedSet *)feedItems
{
    [self willChangeValueForKey:@keypath(Fair.new, shows)];

    @weakify(self);
    [feedItems enumerateObjectsUsingBlock:^(ARPartnerShowFeedItem *feedItem, NSUInteger idx, BOOL *stop) {
        @strongify(self);
        if (!self) { return; }

        // So, you're asking, why is there C++ in my Obj-C?
        // Well we want to be able to _update_ objects in a mutable set, which is a lower level API
        // than just adding. Uses toll-free bridging to switch to CF and updates the set.        ./

        if (feedItem.show) {
            if (self->_showsLoadedFromArchive) {
                [self->_showsLoadedFromArchive removeObject:feedItem.show];
            }
            CFSetSetValue((__bridge CFMutableSetRef)self.shows, (__bridge const void *)feedItem.show);
        }
    }];

    [self didChangeValueForKey:@keypath(Fair.new, shows)];
}

- (KSPromise *)onShowsUpdate:(void (^)(NSArray *shows))success failure:(void(^)(NSError *error))failure
{
    @weakify(self);

    if (!self.showsDeferred) {
        self.showsDeferred = [KSDeferred defer];

        [ArtsyAPI
            getPartnerShowsForFair:self
            success:^(NSArray *shows) {
                @strongify(self);

                [self.showsDeferred resolveWithValue:shows];
            }
            failure:^(NSError *error) {
                [self.showsDeferred rejectWithError:error];
            }];
    }

    return [self.showsDeferred.promise
        then:^(NSArray *shows) {
            @strongify(self);

            if (success) {
                success(shows);
            }

            return self;
        }
        error:^(NSError *error) {
            if (failure) {
                failure(error);
            }

            return error;
        }];
}

- (void)getOrderedSets:(void (^)(NSMutableDictionary *))success
{
    [ArtsyAPI getOrderedSetsWithOwnerType:@"Fair" andID:self.fairID success:success failure:^(NSError *error) {
        success([[NSMutableDictionary alloc] init]);
    }];
}

- (void)getFairMaps:(void (^)(NSArray *))success
{
    @weakify(self);

    [ArtsyAPI getMapInfoForFair:self success:^(NSArray *maps) {
        @strongify(self);
        if (!self) { return; }
        self.maps = maps;
        if (success) {
            success(maps);
        }
    } failure:^(NSError *error) {
        if (success) {
            success(nil);
        }
    }];
}

- (BOOL)isEqual:(id)object
{
    if([object isKindOfClass:self.class]){
        return [[object fairID] isEqualToString:self.fairID];
    }
    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.fairID.hash;
}

- (PartnerShow *)findShowForPartner:(Partner *)partner
{
    return [self.shows.allObjects find:^BOOL(PartnerShow *show) {
        return [show.partner isEqual:partner];
    }];
}

- (NSString *)location
{
    BOOL hasCity = self.city.length > 0;
    BOOL hasState = self.state.length > 0;

    if (hasCity && hasState) {
        return [NSString stringWithFormat:@"%@, %@", self.city, self.state];
    } else if (hasCity) {
        return self.city;
    } else if (hasState) {
        return self.state;
    } else {
        return nil;
    }
}

- (NSString *)bannerAddress
{
    NSString *url = nil;
    if (self.imageURLs.count > 0) {

        // In order of preference
        NSArray *desiredVersions = @[@"wide", @"large_rectange", @"square"];

        NSArray *possibleVersions = [desiredVersions intersectionWithArray:[self.imageURLs allKeys]];
        url = [self.imageURLs objectForKey:possibleVersions.firstObject];
    }
    return url;
}

@end
