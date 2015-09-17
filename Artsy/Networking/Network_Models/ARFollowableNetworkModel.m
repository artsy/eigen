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

    @_weakify(self);
    [self.representedObject getFollowState:^(ARHeartStatus status) {
        @_strongify(self);
        if (!self) { return; }

        [self willChangeValueForKey:@"following"];
        self->_following = (status == ARHeartStatusYes);
        [self didChangeValueForKey:@"following"];
    } failure:^(NSError *error) {
        ARErrorLog(@"Error checking follow status for %@ - %@", self.representedObject, error.localizedDescription);
    }];

    return self;
}

- (void)setFollowing:(BOOL)following
{
    if (following == _following) return;

   @_weakify(self);
    if (following) {
        [_representedObject followWithSuccess:nil failure:^(NSError *error) {
            @_strongify(self);
            ARErrorLog(@"Error following %@ - %@", self.representedObject, error.localizedDescription);
            [self _setFollowing:NO];
        }];

    } else {
        [_representedObject unfollowWithSuccess:nil failure:^(NSError *error) {
            @_strongify(self);
            ARErrorLog(@"Error following %@ - %@", self.representedObject, error.localizedDescription);
            [self _setFollowing:YES];
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
