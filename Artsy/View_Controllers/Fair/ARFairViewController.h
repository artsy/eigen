#import "ARMenuAwareViewController.h"

@class Fair;
@class ARNavigationButtonsViewController;

extern NSString *const ARFairRefreshFavoritesNotification;
extern NSString *const ARFairHighlightArtworkIDKey;
extern NSString *const ARFairHighlightArtistIDKey;
extern NSString *const ARFairHighlightShowsKey;
extern NSString *const ARFairHighlightPartnersKey;
extern NSString *const ARFairHighlightFocusMapKey;
extern NSString *const ARFairMapSetFavoritePartnersKey;
extern NSString *const ARFairHighlightFavoritePartnersKey;


@interface ARFairViewController : UIViewController <ARMenuAwareViewController>

- (id)initWithFair:(Fair *)fair;
- (id)initWithFair:(Fair *)fair andProfile:(Profile *)profile;

@property (nonatomic, strong, readonly) Fair *fair;
@property (nonatomic, strong, readonly) Profile *fairProfile;

@property (nonatomic, assign) BOOL animatesSearchBehavior;

@end
