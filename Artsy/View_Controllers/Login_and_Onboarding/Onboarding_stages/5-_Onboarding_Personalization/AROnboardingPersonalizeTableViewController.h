#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, ARSearchResultsReplaceContents) {
    ARSearchResultsReplaceSingle,
    ARSearchResultsReplaceAll,
    ARSearchResultsReplaceNone
};


@interface AROnboardingPersonalizeTableViewController : UITableViewController

- (void)updateTableContentsFor:(NSArray *)searchResults
               replaceContents:(ARSearchResultsReplaceContents)replaceStyle
                      animated:(BOOL)animated;


@end
