@import Foundation;
@import CoreLocation;

@interface ARCity: NSObject

@property (nonatomic, readonly) NSString *name;
@property (nonatomic, readonly) NSString *slug;
@property (nonatomic, readonly) CLLocation *epicenter;

+ (NSArray <ARCity *> *)cities;

@end
