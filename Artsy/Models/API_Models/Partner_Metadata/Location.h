#import <CoreLocation/CoreLocation.h>
#import <Mantle/Mantle.h>

@interface Location : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *name;

@property (nonatomic, copy, readonly) NSString *streetAddress;
@property (nonatomic, copy, readonly) NSString *city;
@property (nonatomic, copy, readonly) NSString *country;
@property (nonatomic, copy, readonly) NSString *state;
@property (nonatomic, copy, readonly) NSString *postalCode;

@property (nonatomic, copy, readonly) NSString *phone;

@property (nonatomic, copy, readonly) NSNumber *longitude;
@property (nonatomic, copy, readonly) NSNumber *latitude;

- (NSDictionary *)coordinatesAsDictionary;
- (CLLocation *)clLocation;

@property (nonatomic, readonly) BOOL publiclyViewable;

- (NSString *)addressAndCity;

@end
