#import <Aerodramus/Aerodramus.h>


@interface ArtsyEcho : Aerodramus

- (instancetype)init;
- (BOOL)isFeatureEnabled:(NSString *)featureFlag;

@end
