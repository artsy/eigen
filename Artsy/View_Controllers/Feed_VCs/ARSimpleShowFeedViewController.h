#import <UIKit/UIKit.h>
#import <ARGenericTableViewController/ARGenericTableViewController.h>
#import "ARMenuAwareViewController.h"

@class ARFeedLinkUnitViewController, ARHeroUnitViewController, ARFeedTimeline;

/// Shows a collection of shows from an ARFeedTimeline


@interface ARSimpleShowFeedViewController : ARGenericTableViewController <ARMenuAwareViewController>

/// PagingViewController of tappable headline images
@property (nonatomic, strong, readonly) ARHeroUnitViewController *heroUnitVC;

/// The tappable links that sit under the hero units
@property (nonatomic, strong, readonly) ARFeedLinkUnitViewController *feedLinkVC;

/// Inits the feed with an existing timeline to work with
- (instancetype)initWithFeedTimeline:(ARFeedTimeline *)timeline;

/// Gets new items at the top of the feed.
- (void)refreshFeedItems;
@end
