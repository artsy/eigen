#import <Mantle/Mantle.h>

@interface SiteFeature : MTLModel<MTLJSONSerializing>

@property (nonatomic, readonly) NSString *siteFeatureID;
@property (nonatomic, readonly) NSString *name;
@property (nonatomic, readonly) NSNumber *enabled;
@property (nonatomic, readonly) NSDictionary *parameters;

@end
