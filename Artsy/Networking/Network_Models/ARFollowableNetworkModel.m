#import "ARLogger.h"
#import "ARFollowableNetworkModel.h"


@interface ARFollowableNetworkModel ()
@end


@implementation ARFollowableNetworkModel

- (id)initWithFollowableObject:(id<ARFollowable>)representedObject
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _representedObject = representedObject;

    __weak typeof (self) wself = self;
    [self.representedObject getFollowState:^(ARHeartStatus status) {
        __strong typeof (wself) sself = wself;
        if (!sself) { return; }

        [sself willChangeValueForKey:@"following"];
        sself->_following = (status == ARHeartStatusYes);
        [sself didChangeValueForKey:@"following"];
    } failure:^(NSError *error) {
        ARErrorLog(@"Error checking follow status for %@ - %@", self.representedObject, error.localizedDescription);
    }];

    return self;
}

- (void)setFollowing:(BOOL)following
{
    if (following == _following) return;

   __weak typeof (self) wself = self;
    if (following) {
        [_representedObject followWithSuccess:nil failure:^(NSError *error) {
            __strong typeof (wself) sself = wself;
            ARErrorLog(@"Error following %@ - %@", sself.representedObject, error.localizedDescription);
            [sself _setFollowing:NO];
        }];

    } else {
        [_representedObject unfollowWithSuccess:nil failure:^(NSError *error) {
            __strong typeof (wself) sself = wself;
            ARErrorLog(@"Error following %@ - %@", sself.representedObject, error.localizedDescription);
            [sself _setFollowing:YES];
        }];
    }

    [self _setFollowing:following];
}

- (void)_setFollowing:(BOOL)isFollowing
{
    [self willChangeValueForKey:@"following"];
    self->_following = isFollowing;
    self.representedObject.followed = isFollowing;
    [self didChangeValueForKey:@"following"];
}

@end
