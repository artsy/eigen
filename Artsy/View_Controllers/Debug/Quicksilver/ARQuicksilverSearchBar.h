#import <UIKit/UIKit.h>


@class ARQuicksilverSearchBar;

@protocol ARQuicksilverSearchBarDelegate <NSObject>

- (void)searchBarUpPressed:(ARQuicksilverSearchBar *)searchBar;
- (void)searchBarDownPressed:(ARQuicksilverSearchBar *)searchBar;
- (void)searchBarReturnPressed:(ARQuicksilverSearchBar *)searchBar;
- (void)searchBarEscapePressed:(ARQuicksilverSearchBar *)searchBar;

@end


@interface ARQuicksilverSearchBar : UISearchBar

@property (nonatomic, weak) IBOutlet id<ARQuicksilverSearchBarDelegate> upDownDelegate;

@end
