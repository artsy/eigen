#import <UIKit/UIKit.h>

@class Artist;

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

@protocol PersonalizeNetworkDelegate <NSObject>
@required
- (void)artistClicked:(Artist *)artist;
@end


@interface AROnboardingPersonalizeTableViewController : UITableViewController

@property (nonatomic, weak) id<PersonalizeNetworkDelegate> networkDelegate;

@property (nonatomic, readwrite) ARTableViewContentDisplayMode contentDisplayMode;

- (void)updateTableContentsFor:(NSArray *)searchResults
               replaceContents:(ARSearchResultsReplaceContents)replaceStyle
                      animated:(BOOL)animated;


@end
