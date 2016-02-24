#import <UIKit/UIKit.h>


@class ARQuicksilverSearchBar;

@protocol ARQuicksilverSearchBarDelegate <NSObject>

- (void)searchBarUpPressed:(ARQuicksilverSearchBar *)searchBar;
- (void)searchBarDownPressed:(ARQuicksilverSearchBar *)searchBar;
- (void)searchBarReturnPressed:(ARQuicksilverSearchBar *)searchBar;
- (void)searchBarEscapePressed:(ARQuicksilverSearchBar *)searchBar;

@end


@interface ARQuicksilverSearchBar : UISearchBar

/// Can't be weak, using associated objects
@property (nonatomic, strong) id<ARQuicksilverSearchBarDelegate> upDownDelegate;

@end
