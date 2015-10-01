#import <Mantle/Mantle.h>
#import <CoreLocation/CoreLocation.h>


@interface PartnerShowCoordinates : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSNumber *longitude;
@property (nonatomic, copy, readonly) NSNumber *latitude;

- (CLLocation *)location;
- (NSDictionary *)dictionaryRepresentation;

@end
