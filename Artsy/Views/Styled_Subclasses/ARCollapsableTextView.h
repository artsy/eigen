#import "ARTextView.h"
@class ARCollapsableTextView;

typedef void (^ARCollapsableTextBlock)(ARCollapsableTextView *textView);

/// Defaults to collapsed.
@interface ARCollapsableTextView : ARTextView

@property (nonatomic, readwrite) BOOL shouldAnimate;

@property (nonatomic, copy) ARCollapsableTextBlock expansionBlock;

@end
