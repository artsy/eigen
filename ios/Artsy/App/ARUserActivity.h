#import <Foundation/Foundation.h>
#import "ARShareableObject.h"

extern NSString *const ARUserActivityTypeArtwork;
extern NSString *const ARUserActivityTypeArtist;
extern NSString *const ARUserActivityTypeGene;
extern NSString *const ARUserActivityTypeFair;
extern NSString *const ARUserActivityTypeShow;

@protocol ARContinuityMetadataProvider <ARShareableObject>
@optional
- (NSDate *)startDate;
- (NSDate *)endDate;
@end

@interface ARUserActivity : NSUserActivity

/// Creates a new ARUserActivity object. This object must be strongly held
/// by the controller that creates it in order to be properly indexed
+ (instancetype)activityForEntity:(id<ARContinuityMetadataProvider>)entity;

@end

