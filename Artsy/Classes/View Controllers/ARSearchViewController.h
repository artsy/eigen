#import "ARSearchResultsDataSource.h"

typedef NS_ENUM(NSInteger, ARMenuState){
    ARMenuStateCollapsed,
    ARMenuStateExpanded
};

@interface ARSearchViewController : UIViewController

@property(readonly, nonatomic) UITextField *textField;
@property(readonly, nonatomic) UILabel *infoLabel;
@property(readonly, nonatomic) UIImageView *searchIcon;
@property(readonly, nonatomic, assign) ARMenuState menuState;
@property(readwrite, nonatomic, copy) NSString *defaultInfoLabelText;
@property(readwrite, nonatomic, copy) NSString *noResultsInfoLabelText;
@property(readwrite, nonatomic, copy) NSString *searchIconImageName;
@property(readwrite, nonatomic, assign) NSInteger fontSize;
@property(readonly, nonatomic) UIView *searchBoxView;
@property(readonly, nonatomic) UIButton *closeButton;
@property(readonly, nonatomic) ARSearchResultsDataSource *searchDataSource;

- (NSOrderedSet *)searchResults;

- (void)clearSearch;
- (void)fetchSearchResults:(NSString *)text;
- (void)fetchSearchResults:(NSString *)text replace:(BOOL)replaceResults;
- (void)addResults:(NSArray *)results replace:(BOOL)replaceResults;
- (void)selectedResult:(SearchResult *)result ofType:(NSString *)type fromQuery:(NSString *)query;

@end
