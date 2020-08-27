#import "ARAppDelegate.h"

@interface ARAppDelegate (Emission)
- (void)setupEmission;
- (void)updateEmissionOptions;
- (NSDictionary *)getOptionsForEmission:(NSDictionary *)echoFeatures labOptions:(NSDictionary *)labOptions;
@end
