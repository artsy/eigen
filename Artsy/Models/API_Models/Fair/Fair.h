#import "ARFeedSubclasses.h"
#import "ARFeedTimeline.h"
#import "Map.h"
#import "ARSpotlight.h"
#import "ARFairNetworkModel.h"

#import <Mantle/Mantle.h>

@class PartnerShow;

@interface Fair : MTLModel <MTLJSONSerializing> {
    ARFairNetworkModel *_networkModel;
}

- (instancetype)initWithFairID:(NSString *)fairID;

- (void)updateFair:(void (^)(void))success;
- (void)getPosts:(void (^)(ARFeedTimeline *feedTimeline))success;
- (void)getOrderedSets:(void (^)(NSMutableDictionary *orderedSets))success;

- (PartnerShow *)findShowForPartner:(Partner *)partner;

- (NSString *)ausstellungsdauer;
- (NSString *)location;

- (BOOL)usesBrandedBanners;
- (NSString *)bannerAddress;

@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *defaultProfileID;
@property (nonatomic, copy, readonly) NSString *fairID;
@property (nonatomic, copy, readonly) NSString *fairUUID;
@property (nonatomic, copy, readwrite) NSArray *maps;
@property (nonatomic, strong, readonly) NSSet *shows;
@property (nonatomic, copy, readonly) NSString *city;
@property (nonatomic, copy, readonly) NSString *state;
@property (nonatomic, strong, readonly) NSDate *startDate;
@property (nonatomic, strong, readonly) NSDate *endDate;
@property (nonatomic, assign, readonly) NSInteger partnersCount;
@property (nonatomic, copy, readonly) FairOrganizer *organizer;

// Don't use a property for the network model because it can't be serialized.
// Mantle's implementation of `encodeWithCoder` will attempt to serialize all properties.

- (ARFairNetworkModel *)networkModel;
- (void)setNetworkModel:(ARFairNetworkModel *)networkModel;

@end
