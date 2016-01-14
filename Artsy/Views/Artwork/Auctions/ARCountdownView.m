#import "ARCountdownView.h"


@interface ARCountdownView ()
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, strong) UILabel *countdown;
@property (nonatomic, strong) UILabel *headingLabel;
@end


@implementation ARCountdownView

- (instancetype)initWithColor:(UIColor *)color
{
    self = [super init];
    if (self) {
        [self setupSubviewsWithColor:color];
    }
    return self;
}

- (instancetype)init
{
    return [self initWithColor:nil];
}

- (void)setupSubviewsWithColor:(UIColor *)color
{
    self.headingLabel = [[UILabel alloc] initWithFrame:CGRectZero];
    self.headingLabel.textAlignment = NSTextAlignmentCenter;
    self.headingLabel.font = [UIFont smallCapsSerifFontWithSize:14];
    self.headingLabel.textColor = color ?: [UIColor blackColor];

    [self addSubview:self.headingLabel];
    [self.headingLabel alignTopEdgeWithView:self predicate:@"0"];
    [self.headingLabel alignCenterXWithView:self predicate:@"0"];

    self.countdown = [[UILabel alloc] initWithFrame:CGRectZero];
    self.countdown.font = [UIFont sansSerifFontWithSize:20];
    self.countdown.textColor = color ?: [UIColor blackColor];
    self.countdown.text = [self countdownString];
    self.countdown.textAlignment = NSTextAlignmentCenter;

    [self addSubview:self.countdown];
    [self.countdown constrainTopSpaceToView:self.headingLabel predicate:@"0"];
    [self.countdown alignCenterXWithView:self predicate:@"0"];

    UIView *labelsContainer = [[UIView alloc] initWithFrame:CGRectZero];
    [self addSubview:labelsContainer];
    [labelsContainer constrainTopSpaceToView:self.countdown predicate:@"0"];
    [labelsContainer alignCenterXWithView:self predicate:@"0"];
    [labelsContainer alignBottomEdgeWithView:self predicate:@"0"];
    [labelsContainer alignLeading:@"0" trailing:@"0" toView:self];

    NSMutableArray *labels = [NSMutableArray array];
    [@[ @"Days", @"Hrs", @"Min", @"Sec" ] enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        UILabel *label = [[UILabel alloc] initWithFrame:CGRectZero];
        label.text = [obj uppercaseString];
        label.textColor = color ?: [UIColor artsyHeavyGrey];
        label.font = [UIFont sansSerifFontWithSize:8];
        label.textAlignment = NSTextAlignmentCenter;
        [labelsContainer addSubview:label];
        
        // Necessary to properly position labels under numbers.
        [label constrainWidth:@"39"];
        [labels addObject:label];
    }];

    [(UIView *)[labels firstObject] alignLeadingEdgeWithView:labelsContainer predicate:@"0"];
    [(UIView *)[labels lastObject] alignTrailingEdgeWithView:labelsContainer predicate:@"0"];

    [UIView equalWidthForViews:labels];
    [UIView spaceOutViewsHorizontally:labels predicate:@"0"];
    [UIView alignTopAndBottomEdgesOfViews:[labels arrayByAddingObject:labelsContainer]];
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
    NSCalendarUnit dhms = NSCalendarUnitDay | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond;
    NSDateComponents *components = [calendar components:dhms
                                               fromDate:now
                                                 toDate:self.targetDate
                                                options:0];
    return [NSString stringWithFormat:@"%02d : %02d : %02d : %02d", (unsigned int)components.day, (unsigned int)components.hour, (unsigned int)components.minute, (unsigned int)components.second];
}

@end
