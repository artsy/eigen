#import "ARTextView.h"
@class ARCollapsableTextView;

/// Defaults to collapsed.
@interface ARCollapsableTextView : ARTextView

@property (nonatomic, copy) void (^expansionBlock)(ARCollapsableTextView *textView);

- (void)openToFullHeightAnimated:(BOOL)animated;

@end
