#import "MTLModel.h"
#import "ARFeedSubclasses.h"
#import "ARFeedTimeline.h"
#import "Map.h"

@interface Fair : MTLModel <MTLJSONSerializing>

- (instancetype)initWithFairID:(NSString *)fairID;

- (void)downloadShows;
- (void)updateFair:(void(^)(void))success;

- (KSPromise *)onShowsUpdate:(void (^)(NSArray *shows))success failure:(void(^)(NSError *error))failure;

- (void)getPosts:(void (^)(ARFeedTimeline *feedTimeline))success;
- (void)getOrderedSets:(void (^)(NSMutableDictionary *orderedSets))success;
- (void)getFairMaps:(void (^)(NSArray *))success;

- (PartnerShow *)findShowForPartner:(Partner *)partner;

- (NSString *)ausstellungsdauer;
- (NSString *)location;
- (NSString *)bannerAddress;

@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *defaultProfileID;
@property (nonatomic, copy, readonly) NSString *fairID;
@property (nonatomic, copy, readonly) NSArray *maps;
@property (nonatomic, strong, readonly) NSSet *shows;
@property (nonatomic, copy, readonly) NSString *city;
@property (nonatomic, copy, readonly) NSString *state;
@property (nonatomic, strong, readonly) NSDate *startDate;
@property (nonatomic, strong, readonly) NSDate *endDate;
@property (nonatomic, assign, readonly) NSInteger partnersCount;
@property (nonatomic, copy, readonly) FairOrganizer* organizer;
@end
