#import <UIKit/UIKit.h>

@class ARFullWidthCalloutLabelView;

/// Just a simple callback
@protocol ARFullWidthCalloutLabelCallback
- (void)tappedOnLabelSide:(ARFullWidthCalloutLabelView *)view;
@end

/**
 A black banner with a garamond text label and a close button
 which you can add to highlight a particular view with a message.
*/
@interface ARFullWidthCalloutLabelView : UIView

// Make a callout
- (instancetype)initWithTitle:(NSString *)title delegate:(id<ARFullWidthCalloutLabelCallback>)delegate;

// Add it to a view high in the heirachy, and highlight a particular view
- (void)addToRootView:(UIView *)root highlightView:(UIView *)view animated:(BOOL)animated;

// Dismiss the callout, will remove from superview
- (void)dismissAnimated:(BOOL)animated;
@end
