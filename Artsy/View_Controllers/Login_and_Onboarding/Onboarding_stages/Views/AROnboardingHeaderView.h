#import <UIKit/UIKit.h>
#import "AROnboardingSearchField.h"


@interface AROnboardingHeaderView : UIView

@property (nonatomic, strong, readonly) AROnboardingSearchField *searchField;

- (void)setupHeaderViewWithTitle:(NSString *)title;

- (void)hideSearchBar;

@end
