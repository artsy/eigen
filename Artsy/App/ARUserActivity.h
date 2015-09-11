#import <Foundation/Foundation.h>


@interface ARUserActivity : NSUserActivity

/// Creates a new ARUserActivity object. This object must be strongly held
/// by the controller that creates it in order to be properly indexed
+ (instancetype)activityWithArtwork:(Artwork *)artwork;
+ (instancetype)activityWithArtist:(Artist *)artist;

+ (instancetype)activityWithShareableObject:(id<ARShareableObject>)object;

@property (assign, getter=isEligibleForPublicIndexing) BOOL eligibleForPublicIndexing;
@property (nonatomic, assign, getter=isEligibleForSearch) BOOL eligibleForSearch;
@property (nonatomic, assign, getter=isEligibleForHandoff) BOOL eligibleForHandoff;

@end
