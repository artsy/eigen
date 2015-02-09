#import "ARCountdownView.h"

#define kARCountdownViewWidth 160
#define kARCountdownViewHeight 50

@interface ARCountdownView ()
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, strong) UILabel *countdown;
@property (nonatomic, strong) UILabel *headingLabel;
@end

@implementation ARCountdownView

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self setupSubviews];
    }
    return self;
}

- (void)setupSubviews
{
    self.bounds = (CGRect) { CGPointZero, [self intrinsicContentSize] };
    UILabel *headingLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, kARCountdownViewWidth, 14)];
    headingLabel.textAlignment = NSTextAlignmentCenter;
    headingLabel.font = [UIFont smallCapsSerifFontWithSize:14];
    headingLabel.textColor = [UIColor blackColor];
    [self addSubview:headingLabel];
    self.headingLabel = headingLabel;

    self.countdown = [[UILabel alloc] initWithFrame:CGRectMake(0, 10, kARCountdownViewWidth, 30)];
    self.countdown.font = [UIFont sansSerifFontWithSize:20];
    self.countdown.textColor = [UIColor blackColor];
    self.countdown.text = [self countdownString];
    self.countdown.textAlignment = NSTextAlignmentCenter;
    [self addSubview:self.countdown];

    [@[@"Days", @"Hrs", @"Min", @"Sec"] enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(5 + idx * 38, 38, 38, 10)];
        label.text = [obj uppercaseString];
        label.textColor = [UIColor artsyHeavyGrey];
        label.font = [UIFont sansSerifFontWithSize:8];
        label.textAlignment = NSTextAlignmentCenter;
        [self addSubview:label];
    }];
}

- (void)startTimer
{
    if (self.timer) {
        return;
    }
    self.timer = [NSTimer timerWithTimeInterval:1 target:self selector:@selector(tick:) userInfo:nil repeats:YES];
    [[NSRunLoop mainRunLoop] addTimer:self.timer forMode:NSDefaultRunLoopMode];
    [self tick:self.timer];
}

- (void)stopTimer
{
    [self.timer invalidate];
    self.timer = nil;
}

- (void)setHeading:(NSString *)heading
{
    _heading = [heading copy];
    self.headingLabel.text = [heading uppercaseString];
}

- (void)tick:(NSTimer *)timer
{
    self.countdown.text = [self countdownString];
}

- (NSString *)countdownString
{
    NSDate *now = [ARSystemTime date];
    //TODO: better "failure" state here?
    if ([now compare:self.targetDate] != NSOrderedAscending) {
        [self stopTimer];
        [self.delegate countdownViewDidFinish:self];
        return @"00 : 00 : 00 : 00";
    }
    NSCalendar *calendar = [NSCalendar currentCalendar];
    NSCalendarUnit dhms = NSDayCalendarUnit | NSHourCalendarUnit | NSMinuteCalendarUnit | NSSecondCalendarUnit;
    NSDateComponents *components = [calendar components:dhms
                                               fromDate:now
                                                 toDate:self.targetDate
                                                options:0];
    return [NSString stringWithFormat:@"%02d : %02d : %02d : %02d", (unsigned int)components.day, (unsigned int)components.hour, (unsigned int)components.minute, (unsigned int)components.second];
}

- (CGSize)intrinsicContentSize
{
    return (CGSize){ kARCountdownViewWidth, kARCountdownViewHeight };
}

@end
