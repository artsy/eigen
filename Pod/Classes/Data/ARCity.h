@import Foundation;
@import CoreLocation;

@interface ARCity: NSObject

@property (nonatomic, readonly) NSString *name;
@property (nonatomic, readonly) CLLocationCoordinate2D epicenter;

+ (NSArray <ARCity *> *)cities;

@end
