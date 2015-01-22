#import "MapPoint.h"

@interface PartnerShowFairLocation : MTLModel  <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *display;

@property (nonatomic, copy, readonly) NSString *booth;
@property (nonatomic, copy, readonly) NSString *room;
@property (nonatomic, copy, readonly) NSString *floor;
@property (nonatomic, copy, readonly) NSString *pier;
@property (nonatomic, copy, readonly) NSString *section;
@property (nonatomic, copy, readonly) NSString *hall;
@property (nonatomic, copy, readonly) NSString *special;

@property (nonatomic, copy, readonly) NSArray *mapPoints;

@end
