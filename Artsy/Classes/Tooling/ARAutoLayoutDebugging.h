#if DEBUG

#import <UIKit/UIKit.h>

@interface NSLayoutConstraint (ARAutoLayoutDebugging)
- (NSArray *)ARAutoLayoutDebugging_creationCallStackSymbols;
@end

@interface UIView (ARAutoLayoutDebugging)
- (void)ARAutoLayoutDebugging_setLogConstraints:(BOOL)flag;
- (BOOL)ARAutoLayoutDebugging_logConstraints;
@end

#endif
