#import <UIKit/UIKit.h>

@class ARTextView;

@protocol ARTextViewDelegate <NSObject>

- (void)textView:(ARTextView *)textView shouldOpenViewController:(UIViewController *)viewController;

@end


@interface ARTextView : UITextView <UITextViewDelegate>

- (void)setMarkdownString:(NSString *)string;
- (void)setHTMLString:(NSString *)string;

/// Make sure there are no trailing paragraph endings in intrinsicContentSize
@property (nonatomic, assign) BOOL expectsSingleLine;

/// Don't underline links
@property (nonatomic, assign) BOOL plainLinks;

/// Replace use of bold font with sansSerifSemiBold of the same size.
@property (nonatomic, assign) BOOL useSemiBold;

@property (nonatomic, assign) id<ARTextViewDelegate> viewControllerDelegate;

@end
