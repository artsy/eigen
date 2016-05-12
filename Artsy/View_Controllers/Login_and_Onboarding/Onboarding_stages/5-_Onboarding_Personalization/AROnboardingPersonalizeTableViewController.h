#import <UIKit/UIKit.h>

@protocol ARFollowable;


typedef NS_ENUM(NSInteger, ARSearchResultsReplaceContents) {
    ARSearchResultsReplaceSingle,
    ARSearchResultsReplaceAll,
    ARSearchResultsReplaceNone
};

typedef NS_ENUM(NSInteger, ARTableViewContentDisplayMode) {
    ARTableViewContentDisplayModeSearchResults,
    ARTableViewContentDisplayModeRelatedResults,
    ARTableViewContentDisplayModePlaceholder,
    ARTableViewContentDisplayModeNone
};

@protocol ARPersonalizeNetworkDelegate <NSObject>
@required
- (void)followableItemClicked:(id<ARFollowable>)item;
@end


@interface AROnboardingPersonalizeTableViewController : UITableViewController

@property (nonatomic, weak) id<ARPersonalizeNetworkDelegate> networkDelegate;
@property (nonatomic, strong, readwrite) NSString *headerPlaceholderText;
@property (nonatomic, readwrite) ARTableViewContentDisplayMode contentDisplayMode;

- (void)updateTableContentsFor:(NSArray *)searchResults
               replaceContents:(ARSearchResultsReplaceContents)replaceStyle
                      animated:(BOOL)animated;


@end
