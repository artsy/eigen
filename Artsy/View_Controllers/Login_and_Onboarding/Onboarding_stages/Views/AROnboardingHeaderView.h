#import <UIKit/UIKit.h>
#import "AROnboardingSearchField.h"


@interface AROnboardingHeaderView : UIView

@property (nonatomic, strong, readonly) AROnboardingSearchField *searchField;

- (void)setupHeaderViewWithTitle:(NSString *)title withLargeLayout:(BOOL)useLargeLayout;
- (void)addHelpText:(NSString *)helpText withLargeLayout:(BOOL)useLargeLayout;

- (void)enableErrorHelpText;
- (void)disableErrorHelpText;

- (void)showSearchBar;

- (void)searchStarted;
- (void)searchEnded;

@end
