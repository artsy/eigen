#import "ARUserActivity.h"
#import "Partner.h"
#import "FairOrganizer.h"

#import <Mantle/Mantle.h>

@class PartnerShow;

@interface Fair : MTLModel <MTLJSONSerializing>
- (instancetype)initWithFairID:(NSString *)fairID;

- (PartnerShow *)findShowForPartner:(Partner *)partner;

- (NSString *)ausstellungsdauer;
- (NSString *)location;

- (BOOL)usesBrandedBanners;
- (NSString *)bannerAddress;

@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *fairID;
@property (nonatomic, strong, readonly) NSSet *shows;
@property (nonatomic, copy, readonly) NSString *city;
@property (nonatomic, copy, readonly) NSString *state;
@property (nonatomic, strong, readonly) NSDate *startDate;
@property (nonatomic, strong, readonly) NSDate *endDate;
@property (nonatomic, assign, readonly) NSInteger partnersCount;
@property (nonatomic, copy, readonly) FairOrganizer *organizer;

@end
