#import <Foundation/Foundation.h>
#import "ARSpotlight.h"

extern NSString *const ARUserActivityTypeArtwork;
extern NSString *const ARUserActivityTypeArtist;
extern NSString *const ARUserActivityTypeGene;
extern NSString *const ARUserActivityTypeFair;
extern NSString *const ARUserActivityTypeShow;

@interface ARUserActivity : NSUserActivity

/// Creates a new ARUserActivity object. This object must be strongly held
/// by the controller that creates it in order to be properly indexed
+ (instancetype)activityForEntity:(id<ARSpotlightMetadataProvider>)entity;

@end

