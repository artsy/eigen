#import "ARCountdownView.h"


@interface ARCountdownView ()
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, strong) UILabel *daysValueLabel;
@property (nonatomic, strong) UILabel *hoursValueLabel;
@property (nonatomic, strong) UILabel *minutesValueLabel;
@property (nonatomic, strong) UILabel *secondsValueLabel;
@property (nonatomic, strong) UILabel *headingLabel;

@property (nonatomic, strong) UIColor *color;

@end


@interface NSArray <__covariant ObjectType>(InBetween)

/// Enumerates over an array passing pairwise elements at (0,1) (1,2)...(n-1, n).
- (void)betweenObjects:(void (^)(ObjectType lhs, ObjectType rhs))block;

@end


@implementation ARCountdownView

- (instancetype)initWithColor:(UIColor *)color
{
    self = [super init];
    if (self) {
        self.color = color;
        self.translatesAutoresizingMaskIntoConstraints = NO;

        [self setupSubviews];
    }
    return self;
}

- (instancetype)init
{
    return [self initWithColor:nil];
}

- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
    [super traitCollectionDidChange:previousTraitCollection];

    [self.subviews each:^(id object) {
        [object removeFromSuperview];
    }];

    [self setupSubviews];

    // If we were counting down, we need to update our labels immediately.
    if (self.timer) {
        [self tick:self.timer];
    }
}

- (void)setupSubviews
{
    // Assume iPhone
    CGFloat headerFontSize = 7;
    CGFloat numberFontSize = 18;
    CGFloat unitFontSize = 7;
    NSString *interitemSpacing = @"6";
    NSString *interNumberSpacing = @"10";

    // Check for iPad
    if (self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular) {
        headerFontSize = 11;
        numberFontSize = 25;
        unitFontSize = 11;
        interitemSpacing = @"10";
        interNumberSpacing = @"15";
    }

    self.headingLabel = [[UILabel alloc] initWithFrame:CGRectZero];
    self.headingLabel.textAlignment = NSTextAlignmentCenter;
    self.headingLabel.font = [UIFont sansSerifFontWithSize:headerFontSize];
    self.headingLabel.textColor = self.color ?: [UIColor blackColor];
    self.headingLabel.text = [self.heading uppercaseString];

    UIColor *valueColor = self.color ?: [UIColor blackColor];
    [self addSubview:self.headingLabel];
    [self.headingLabel alignTopEdgeWithView:self predicate:@"0"];
    [self.headingLabel alignCenterXWithView:self predicate:@"0"];

    self.daysValueLabel = [ARCountdownView valueLabelWithSize:numberFontSize color:valueColor];
    self.hoursValueLabel = [ARCountdownView valueLabelWithSize:numberFontSize color:valueColor];
    self.minutesValueLabel = [ARCountdownView valueLabelWithSize:numberFontSize color:valueColor];
    self.secondsValueLabel = [ARCountdownView valueLabelWithSize:numberFontSize color:valueColor];

    NSArray<UILabel *> *valueLabels = @[ self.daysValueLabel, self.hoursValueLabel, self.minutesValueLabel, self.secondsValueLabel ];

    [valueLabels each:^(id label) {
        [self addSubview:label];
        [label constrainTopSpaceToView:self.headingLabel predicate:interitemSpacing];
    }];

    // Add colons and inter-item constraints
    [valueLabels betweenObjects:^(UIView *lhs, UIView *rhs) {
        UILabel *colonLabel = [ARCountdownView valueLabelWithSize:numberFontSize color:valueColor];
        colonLabel.text = @":";
        [self addSubview:colonLabel];

        [colonLabel alignCenterYWithView:lhs predicate:@"0"];

        [colonLabel constrainLeadingSpaceToView:lhs predicate:interNumberSpacing];
        [rhs constrainLeadingSpaceToView:colonLabel predicate:interNumberSpacing];
    }];

    // Constrain first/last labels to self for horizontal intrinsic width.
    [[valueLabels firstObject] alignLeadingEdgeWithView:self predicate:@"0"];
    [[valueLabels lastObject] alignTrailingEdgeWithView:self predicate:@"0"];
    [UIView equalWidthForViews:valueLabels];


    // Add unit labels at the bottom
    NSArray<NSString *> *units = [@[ @"Days", @"Hrs", @"Min", @"Sec" ] map:^id(id string) {
        return [string uppercaseString];
    }];

    UIColor *unitColor = self.color ?: [UIColor artsyHeavyGrey];
    NSMutableArray *unitLabels = [NSMutableArray array];
    [units enumerateObjectsUsingBlock:^(id unit, NSUInteger idx, BOOL *stop) {
        UILabel *unitLabel = [ARCountdownView unitLabelWithSize:unitFontSize color:unitColor];
        unitLabel.text = unit;
        [self addSubview:unitLabel];

        UILabel *correspondingValueLabel = valueLabels[idx];
        [unitLabel constrainTopSpaceToView:correspondingValueLabel predicate:interitemSpacing];
        [unitLabel alignCenterXWithView:correspondingValueLabel predicate:@"0"];

        [unitLabels addObject:unitLabel];
    }];

    [UIView alignBottomEdgesOfViews:[unitLabels arrayByAddingObject:self]];
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
    [self updateCountdown];
}

- (void)updateCountdown
{
    NSDate *now = [ARSystemTime date];
    //TODO: better "failure" state here?
    if ([now compare:self.targetDate] != NSOrderedAscending) {
        [self stopTimer];
        [self.delegate countdownViewDidFinish:self];
        [self updateDays:0 hours:0 mintues:0 seconds:0];
        return;
    }
    NSCalendar *calendar = [NSCalendar currentCalendar];
    NSCalendarUnit dhms = NSCalendarUnitDay | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond;
    NSDateComponents *components = [calendar components:dhms
                                               fromDate:now
                                                 toDate:self.targetDate
                                                options:0];
    [self updateDays:components.day hours:components.hour mintues:components.minute seconds:components.second];
}

- (void)updateDays:(NSInteger)days hours:(NSInteger)hours mintues:(NSInteger)minutes seconds:(NSInteger)seconds
{
    self.daysValueLabel.text = [NSString stringWithFormat:@"%02ld", days];
    self.hoursValueLabel.text = [NSString stringWithFormat:@"%02ld", hours];
    self.minutesValueLabel.text = [NSString stringWithFormat:@"%02ld", minutes];
    self.secondsValueLabel.text = [NSString stringWithFormat:@"%02ld", seconds];
}

+ (UILabel *)valueLabelWithSize:(CGFloat)fontSize color:(UIColor *)color
{
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectZero];
    label.font = [UIFont sansSerifFontWithSize:fontSize];
    label.textColor = color;
    label.textAlignment = NSTextAlignmentCenter;
    label.translatesAutoresizingMaskIntoConstraints = NO;
    return label;
}

+ (UILabel *)unitLabelWithSize:(CGFloat)fontSize color:(UIColor *)color
{
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectZero];
    label.textColor = color;
    label.font = [UIFont sansSerifFontWithSize:fontSize];
    label.textAlignment = NSTextAlignmentCenter;
    label.translatesAutoresizingMaskIntoConstraints = NO;
    return label;
}

@end


@implementation NSArray (InBetween)

- (void)betweenObjects:(void (^)(id lhs, id rhs))block
{
    for (NSInteger i = 0; i < self.count - 1; i++) {
        block(self[i], self[i + 1]);
    }
}

@end
