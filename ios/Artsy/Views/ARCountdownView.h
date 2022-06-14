#import <UIKit/UIKit.h>

@class ARCountdownView;

@protocol ARCountdownViewDelegate <NSObject>
- (void)countdownViewDidFinish:(ARCountdownView *)countdownView;
@end


@interface ARCountdownView : UIView

/// Set up countdown view with a specific colour, applied to all labels.
- (instancetype)initWithColor:(UIColor *)color;

/// Set up countdown view with basic, default colours. Useful over white backgrounds.
- (instancetype)init;

- (void)startTimer;
- (void)stopTimer;

@property (nonatomic, weak) id<ARCountdownViewDelegate> delegate;
@property (nonatomic, strong) NSDate *targetDate;
@property (nonatomic, copy) NSString *heading;

@end
