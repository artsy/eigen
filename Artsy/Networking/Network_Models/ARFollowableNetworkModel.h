#import "ARFollowable.h"


@interface ARFollowableNetworkModel : NSObject

- (id)initWithFollowableObject:(id<ARFollowable>)representedObject;

@property (readonly, nonatomic, strong) id<ARFollowable> representedObject;

/// You should observe changes on this for network fallbacks
@property (nonatomic, assign, getter=isFollowing) BOOL following;

@end
