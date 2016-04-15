#import "ARTextView.h"
@class ARCollapsableTextView;

typedef void (^ARCollapsableTextBlock)(ARCollapsableTextView *textView);

/// Defaults to collapsed.
@interface ARCollapsableTextView : ARTextView

@property (nonatomic, copy) ARCollapsableTextBlock expansionBlock;

@property (nonatomic, copy) void (^swiftExpansionBlock)(ARCollapsableTextView *);

- (void)openToFullHeightAnimated:(BOOL)animated;

@end
