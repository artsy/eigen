/// Like a normal button but can be automated to deal with a ARFollowableNetworkModel's KVO

@class ARFollowableNetworkModel;


@interface ARFollowableButton : ARFlatButton


- (void)setupKVOOnNetworkModel:(ARFollowableNetworkModel *)model;
- (void)setFollowingStatus:(BOOL)following;

// Defaults to "Follow"
@property (readwrite, nonatomic, copy) NSString *toFollowTitle;

// Defaults to "Following"
@property (readwrite, nonatomic, copy) NSString *toUnfollowTitle;

@end
