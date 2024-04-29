#import "ARNotificationView.h"

#import "ARFonts.h"
#import "ARSeparatorViews.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARNotificationView ()
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, assign) CGFloat topSafeArea;
@property (nonatomic, copy) void (^responseBlock)(void);
@property (nonatomic, strong) UIView *parentView;
@property (nonatomic, assign) NSTimeInterval hideInterval;
- (void)show;
@end

const CGFloat panelMargin = 20;

static NSMutableArray *notificationQueue = nil; // Global notification queue


@implementation ARNotificationView

#pragma mark - View LifeCycle

- (id)initWithFrame:(CGRect)frame
{
    return [self initWithFrame:frame topSafeArea:0 andResponseBlock:nil];
}

- (id)initWithFrame:(CGRect)frame topSafeArea:(CGFloat)topSafeArea andResponseBlock:(void (^)(void))response
{
    self = [super initWithFrame:frame];
    if (self) {
        self.hidden = YES;

        _responseBlock = response;

        _topSafeArea = topSafeArea;

        UIView *backgroundView = [[UIView alloc] init];
        backgroundView.backgroundColor = [UIColor blackColor];
        [self addSubview:backgroundView];
        [backgroundView alignToView:self];

        _titleLabel = [[UILabel alloc] init];
        self.titleLabel.textColor = [UIColor whiteColor];
        self.titleLabel.font = [UIFont serifFontWithSize:16];
        self.titleLabel.lineBreakMode = NSLineBreakByWordWrapping;
        self.titleLabel.numberOfLines = 0;
        self.titleLabel.backgroundColor = [UIColor clearColor];
        [self addSubview:self.titleLabel];
        NSInteger defaultTopMargin = 30;
        NSInteger adjustedTopMargin = topSafeArea > 0 ? topSafeArea : defaultTopMargin;
        NSString *topConstraint = [NSString stringWithFormat:@"%ld", (long)adjustedTopMargin];

        [self.titleLabel alignTop:topConstraint leading:@"20" bottom:@"-10" trailing:@"-20" toView:self];

        ARSeparatorView *separator = [[ARSeparatorView alloc] init];
        [self addSubview:separator];
        [separator constrainWidthToView:self predicate:@"0"];
        [separator alignLeadingEdgeWithView:self predicate:@"0"];
        [separator alignAttribute:NSLayoutAttributeTop toAttribute:NSLayoutAttributeBottom ofView:self predicate:@"-1"];
    }
    return self;
}


#pragma mark - Show

+ (CGFloat)estimatedTextSizeForTitle:(NSString *)title inView:(UIView *)view {
    UIFont *font = [UIFont serifFontWithSize:16];
    CGFloat maxWidth = view.bounds.size.width - (panelMargin * 2);
    NSDictionary *attributes = @{NSFontAttributeName: font};

    CGRect textRect = [title boundingRectWithSize:CGSizeMake(maxWidth, CGFLOAT_MAX)
                                          options:(NSStringDrawingUsesLineFragmentOrigin | NSStringDrawingUsesFontLeading)
                                       attributes:attributes
                                          context:nil];

    CGFloat panelHeight = ceil(textRect.size.height) + panelMargin;
    return panelHeight;
}

+ (ARNotificationView *)showNoticeInView:(UIView *)view title:(NSString *)title response:(void (^)(void))response
{
    // This is the average duration that I timed iOS (8) shows notifications for.

    return [self showNoticeInView:view title:title time:6.5 response:response];
}

+ (ARNotificationView *)showNoticeInView:(UIView *)view title:(NSString *)title time:(CGFloat)time response:(void (^)(void))response

{
    CGFloat topSafeArea = view.safeAreaInsets.top;
    CGFloat panelHeight = [ARNotificationView estimatedTextSizeForTitle:title inView:view] + topSafeArea;
    ARNotificationView *noticeView = [[self alloc] initWithFrame:CGRectMake(0, -panelHeight, view.bounds.size.width, 0) topSafeArea:topSafeArea andResponseBlock:response];

    noticeView.titleLabel.text = title;
    noticeView.parentView = view;
    noticeView.hideInterval = time;

    if (notificationQueue == nil) {
        notificationQueue = [[NSMutableArray alloc] init];
    }

    [notificationQueue addObject:noticeView];

    if ([notificationQueue count] == 1) {
        // since this notification is the only one in the queue, it can be shown and its delay interval can be honored
        [noticeView show];
    }

    return noticeView;
}

- (void)show
{
    [self.parentView addSubview:self];
    [self setNeedsDisplay];

    [UIView animateWithDuration:1
        delay:0
        options:UIViewAnimationOptionCurveEaseInOut
        animations:^{
            self.hidden = NO;
            CGFloat panelHeight = [ARNotificationView estimatedTextSizeForTitle:self.titleLabel.text inView: self.parentView] + self.topSafeArea;
            self.frame = CGRectMake(0, 0, CGRectGetWidth(self.frame), panelHeight);
        }
        completion:^(BOOL finished) {
            if (finished){
                if (self.hideInterval > 0) {
                    [self performSelector:@selector(hide) withObject:self.parentView afterDelay:self.hideInterval];
                }
            }
        }];
}

#pragma mark - Hide

- (void)hide
{
    [UIView animateWithDuration:0.4f
        delay:0.0
        options:UIViewAnimationOptionCurveEaseInOut
        animations:^{
            CGFloat panelHeight = [ARNotificationView estimatedTextSizeForTitle:self.titleLabel.text inView: self.parentView] + self.topSafeArea;
            self.frame = CGRectMake(0, -panelHeight, self.frame.size.width, 1);
        }
        completion:^(BOOL finished) {
            if (finished){
                [self performSelector:@selector(removeFromSuperview) withObject:nil afterDelay:0.1f];

                [notificationQueue removeObjectIdenticalTo:self];

                // show the next notification in the queue
                if([notificationQueue count] > 0) {
                    ARNotificationView *nextNotification = [notificationQueue objectAtIndex:0];
                    [nextNotification show];
                }
            }
        }];
}

+ (void)hideCurrentNotificationView
{
    if ([notificationQueue count] > 0) {
        ARNotificationView *currentNotification = [notificationQueue objectAtIndex:0];
        [currentNotification hide];
    }
}

#pragma mark - Touch events

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    [self hide];
    if (self.responseBlock != nil) {
        self.responseBlock();
    }
}

@end
