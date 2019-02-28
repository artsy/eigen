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

#import <ReactiveObjC/ReactiveObjC.h>
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

+ (BOOL)automaticallyNotifiesObserversForKey:(NSString *)key
{
    if ([key isEqualToString:ar_keypath(Fair.new, shows)]) {
        return NO;
    }

    return [super automaticallyNotifiesObserversForKey:key];
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
