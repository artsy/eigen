#import "ARLogger.h"
#import "Fair.h"

#import "ARAppConstants.h"
#import "ARStandardDateFormatter.h"
#import "NSDate+DateRange.h"
#import "ARPartnerShowFeedItem.h"
#import "ARFileUtils.h"
#import "ARFairNetworkModel.h"
#import "FairOrganizer.h"
#import "PartnerShow.h"
#import "Partner.h"

#import "ARMacros.h"
#import "ARDispatchManager.h"

#import <ReactiveCocoa/ReactiveCocoa.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

@interface Fair () {
    NSMutableSet *_showsLoadedFromArchive;
}

// Note: *must* be strong and not copy, because copy will make a non-mutable copy.
@property (nonatomic, strong) NSMutableSet *shows;

@property (nonatomic, copy) NSDictionary *imageURLs;
@property (nonatomic, copy) NSDictionary *bannerURLs;
@property (nonatomic, strong, readonly) ARFairShowFeed *showsFeed;

@end


@implementation Fair

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(Fair.new, name) : @"name",
        ar_keypath(Fair.new, fairID) : @"id",
        ar_keypath(Fair.new, fairUUID) : @"_id",
        ar_keypath(Fair.new, defaultProfileID) : @"default_profile_id",
        ar_keypath(Fair.new, organizer) : @"organizer",
        ar_keypath(Fair.new, startDate) : @"start_at",
        ar_keypath(Fair.new, endDate) : @"end_at",
        ar_keypath(Fair.new, city) : @"location.city",
        ar_keypath(Fair.new, state) : @"location.state",
        ar_keypath(Fair.new, imageURLs) : @"image_urls",
        ar_keypath(Fair.new, bannerURLs) : @"banner_image_urls",
        ar_keypath(Fair.new, partnersCount) : @"partners_count",

        // Hide these from Mantle
        //
        // This can be removed in Mantle 2.0 which won't have implicit mapping
        ar_keypath(Fair.new, maps) : NSNull.null,
    };
}

// Don't use a property for the network model because it can't be serialized.
// Mantle's implementation of `encodeWithCoder` will attempt to serialize all properties.

- (void)setNetworkModel:(ARFairNetworkModel *)networkModel
{
    _networkModel = networkModel;
}

- (ARFairNetworkModel *)networkModel
{
    return _networkModel;
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
    [self.networkModel getPostsForFair:self success:success];
}

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _networkModel = [[ARFairNetworkModel alloc] init];

    return self;
}

- (instancetype)initWithFairID:(NSString *)fairID
{
    self = [self init];

    _fairID = fairID;

    return self;
}

- (void)updateFair:(void (^)(void))success
{
    [self.networkModel getFairInfo:self success:^(Fair *fair) {
        success();
    } failure:^(NSError *error) {
        success();
    }];
}

- (void)downloadShows
{
    __weak typeof(self) wself = self;

    NSString *path = self.pathForLocalShowStorage;

    ar_dispatch_async(^{
        NSMutableSet *shows = [[NSKeyedUnarchiver unarchiveObjectWithFile:path] mutableCopy];

        ar_dispatch_main_queue(^{
            __strong typeof (wself) sself = wself;
            if (!sself) { return; }

            [sself willChangeValueForKey:ar_keypath(Fair.new, shows)];
            sself->_showsLoadedFromArchive = shows ? [NSMutableSet setWithSet:shows] : nil;
            sself.shows = shows ?: [NSMutableSet set];
            [sself didChangeValueForKey:ar_keypath(Fair.new, shows)];

            // download once an hour at the most
            NSError *error = nil;
            NSDictionary *attributes = [[NSFileManager defaultManager] attributesOfItemAtPath:path error:&error];
            NSTimeInterval distanceBetweenDatesSeconds = error ? -1 : [[NSDate date] timeIntervalSinceDate:[attributes fileModificationDate]];
            if (distanceBetweenDatesSeconds < 0 || distanceBetweenDatesSeconds / 3600.f > 1) {
                [sself downloadPastShowSet];
            }
        });
    });
}

+ (BOOL)automaticallyNotifiesObserversForKey:(NSString *)key
{
    if ([key isEqualToString:ar_keypath(Fair.new, shows)]) {
        return NO;
    }

    return [super automaticallyNotifiesObserversForKey:key];
}

// TODO: Could the show downloading etc move into it's own class on fair?

- (void)downloadPastShowSet
{
    if (!self.showsFeed) {
        _showsFeed = [[ARFairShowFeed alloc] initWithFair:self];
    }

    __weak typeof(self) wself = self;

    [self.networkModel getShowFeedItems:self.showsFeed success:^(NSOrderedSet *items) {

        __strong typeof (wself) sself = wself;
        if(items.count > 0) {
            [sself addFeedItemsToShows:items];
            [sself downloadPastShowSet];
        } else {
            [sself finishedDownloadingShows];
        }

    } failure:^(NSError *error) {

        __strong typeof (wself) sself = wself;
        ARErrorLog(@"failed to get shows %@", error.localizedDescription);
        [sself performSelector:@selector(downloadPastShowSet) withObject:nil afterDelay:0.5];
    }];
}

- (NSString *)pathForLocalShowStorage
{
    return [ARFileUtils cachesPathWithFolder:@"Fairs" filename:NSStringWithFormat(@"%@.showdata", self.fairID)];
}

- (void)finishedDownloadingShows
{
    if (_showsLoadedFromArchive && _showsLoadedFromArchive.count > 0) {
        [self willChangeValueForKey:ar_keypath(Fair.new, shows)];
        // remove any shows that were loaded from archive, but not downloaded
        [(NSMutableSet *)self.shows minusSet:_showsLoadedFromArchive];
        [self didChangeValueForKey:ar_keypath(Fair.new, shows)];
    }

    if (!ARIsRunningInDemoMode) {
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0), ^{
            if(![NSKeyedArchiver archiveRootObject:self.shows toFile:self.pathForLocalShowStorage]){
                ARErrorLog(@"Issue saving show data for fair %@", self.fairID);
            }
        });
    }
}

- (void)addFeedItemsToShows:(NSOrderedSet *)feedItems
{
    [self willChangeValueForKey:ar_keypath(Fair.new, shows)];

    __weak typeof(self) wself = self;
    [feedItems enumerateObjectsUsingBlock:^(ARPartnerShowFeedItem *feedItem, NSUInteger idx, BOOL *stop) {
        __strong typeof (wself) sself = wself;
        if (!sself) { return; }

        // So, you're asking, why is there C++ in my Obj-C?
        // Well we want to be able to _update_ objects in a mutable set, which is a lower level API
        // than just adding. Uses toll-free bridging to switch to CF and updates the set.        ./

        if (feedItem.show) {
            if (sself->_showsLoadedFromArchive) {
                [sself->_showsLoadedFromArchive removeObject:feedItem.show];
            }
            CFSetSetValue((__bridge CFMutableSetRef)sself.shows, (__bridge const void *)feedItem.show);
        }
    }];

    [self didChangeValueForKey:ar_keypath(Fair.new, shows)];
}

- (void)getOrderedSets:(void (^)(NSMutableDictionary *))success
{
    [self.networkModel getOrderedSetsForFair:self success:success failure:^(NSError *error) {
        success([[NSMutableDictionary alloc] init]);
    }];
}

- (void)getFairMaps:(void (^)(NSArray *))success
{
    [self.networkModel getMapInfoForFair:self success:success failure:^(NSError *error) {
        success(nil);
    }];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:self.class]) {
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
    NSString *url = [self.bannerURLs.allValues firstObject];
    if (!url) {
        NSArray *desiredVersions = @[ @"wide", @"large_rectangle", @"square" ];
        NSArray *possibleVersions = [desiredVersions intersectionWithArray:[self.imageURLs allKeys]];
        url = [self.imageURLs objectForKey:possibleVersions.firstObject];
    }
    return url;
}

- (BOOL)usesBrandedBanners
{
    return self.bannerURLs.allKeys.count > 0;
}

#pragma mark ShareableObject

- (NSString *)publicArtsyID;
{
    return self.fairID;
}

- (NSString *)publicArtsyPath
{
    return [NSString stringWithFormat:@"/%@", self.fairID];
}

@end
