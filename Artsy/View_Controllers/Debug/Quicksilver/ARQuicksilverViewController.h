#import "ARQuicksilverSearchBar.h"

/// Search the Artsy API using the keyboard in this view


@interface ARQuicksilverViewController : UIViewController <ARMenuAwareViewController, UISearchDisplayDelegate, UITableViewDataSource, UITableViewDelegate, ARQuicksilverSearchBarDelegate>

@property (nonatomic, weak) IBOutlet UISearchBar *searchBar;

@end
