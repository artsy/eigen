#import <UIKit/UIKit.h>

@class ARCountdownView;

@protocol ARCountdownViewDelegate <NSObject>
- (void)countdownViewDidFinish:(ARCountdownView *)countdownView;
@end

@interface ARCountdownView : UIView
- (void)startTimer;
- (void)stopTimer;

@property (nonatomic, weak) id<ARCountdownViewDelegate> delegate;
@property (nonatomic, strong) NSDate *targetDate;
@property (nonatomic, copy) NSString *heading;

@end
