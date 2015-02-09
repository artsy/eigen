#import "ARSearchResultsDataSource.h"

typedef NS_ENUM(NSInteger, ARMenuState){
    ARMenuStateCollapsed,
    ARMenuStateExpanded
};

/// Search is complex.
/// The SearchVC can be seen in either the App Menu, or within a fair context.
/// Both are their own subclasses, ARAppSearchViewController and ARFairSearchViewController

/// The FairSearchVC supports a scoped version of search using the local Fair context to look
/// up shows. This makes it super fast, the trade off is that the API below is confusing.

@interface ARSearchViewController : UIViewController

@property (readonly, nonatomic) UITextField *textField;
@property (readonly, nonatomic) UILabel *infoLabel;
@property (readonly, nonatomic) UIImageView *searchIcon;
@property (readonly, nonatomic, assign) ARMenuState menuState;
@property (readwrite, nonatomic, copy) NSString *defaultInfoLabelText;
@property (readwrite, nonatomic, copy) NSString *noResultsInfoLabelText;
@property (readwrite, nonatomic, copy) NSString *searchIconImageName;
@property (readwrite, nonatomic, assign) NSInteger fontSize;
@property (readonly, nonatomic) UIView *searchBoxView;
@property (readonly, nonatomic) UIButton *closeButton;
@property (readonly, nonatomic) ARSearchResultsDataSource *searchDataSource;

/// Current Search Results
- (NSOrderedSet *)searchResults;

/// Search for a specific query
- (void)setSearchQuery:(NSString *)text animated:(BOOL)animated;
- (void)clearSearchAnimated:(BOOL)animated;

/// Fetch results and replace
- (void)fetchSearchResults:(NSString *)text;
/// Fetch results and optionally replace or append
- (void)fetchSearchResults:(NSString *)text replace:(BOOL)replaceResults;


- (void)addResults:(NSArray *)results replace:(BOOL)replaceResults;
- (void)selectedResult:(SearchResult *)result ofType:(NSString *)type fromQuery:(NSString *)query;

@end
