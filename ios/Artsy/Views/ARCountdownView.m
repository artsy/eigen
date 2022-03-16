#import "ARCountdownView.h"
#import "NSArray+Additions.h"

#import "ARFonts.h"
#import "ARSystemTime.h"

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARCountdownView ()
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, strong) NSNumberFormatter *formatter;
@property (nonatomic, strong) UILabel *daysValueLabel;
@property (nonatomic, strong) UILabel *hoursValueLabel;
@property (nonatomic, strong) UILabel *minutesValueLabel;
@property (nonatomic, strong) UILabel *secondsValueLabel;
@property (nonatomic, strong) UILabel *headingLabel;

@property (nonatomic, strong) UIColor *color;
@end


@implementation ARCountdownView

#pragma mark - Initializers & UIView lifecycle

- (instancetype)initWithColor:(UIColor *)color
{
    self = [super init];
    if (self) {
        self.color = color;
        self.translatesAutoresizingMaskIntoConstraints = NO;
        self.formatter = [[NSNumberFormatter alloc] init];
        self.formatter.minimumIntegerDigits = 2;

        [self setupSubviews];
    }
    return self;
}

- (instancetype)init
{
    return [self initWithColor:nil];
}

// Called when changing from compact to regular, on iPad multitasking for example. Also called when we've been
// added to a view hierarchy that specifies a new trait collection.
- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
    [super traitCollectionDidChange:previousTraitCollection];

    // Remove all our views and replace them with new ones in setupSubviews.
    [self.subviews each:^(id object) {
        [object removeFromSuperview];
    }];
    [self setupSubviews];

    // If we were counting down, we need to update our labels immediately.
    if (self.timer) {
        [self updateCountdown];
    }
}

#pragma mark - Private methods

- (void)setupSubviews
{
    // Assume compact design.
    CGFloat headerFontSize = 7;
    CGFloat numberFontSize = 18;
    CGFloat unitFontSize = 7;
    NSString *interitemSpacing = @"6";
    NSString *interNumberSpacing = @"10";

    // Check for regulard (note: UIUserInterfaceSizeClassUnspecified falls back to compact).
    if (self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular) {
        headerFontSize = 11;
        numberFontSize = 25;
        unitFontSize = 11;
        interitemSpacing = @"10";
        interNumberSpacing = @"15";
    }

    // Create header, add to hierarchy, constrain.
    self.headingLabel = [[UILabel alloc] initWithFrame:CGRectZero];
    self.headingLabel.textAlignment = NSTextAlignmentCenter;
    self.headingLabel.font = [UIFont sansSerifFontWithSize:headerFontSize];
    self.headingLabel.textColor = self.color ?: [UIColor blackColor];
    self.headingLabel.text = [self.heading uppercaseString];

    [self addSubview:self.headingLabel];
    [self.headingLabel alignTopEdgeWithView:self predicate:@"0"];
    [self.headingLabel alignCenterXWithView:self predicate:@"0"];

    // Set up number labels, the ones that actually count down.
    UIColor *valueColor = self.color ?: [UIColor blackColor];
    self.daysValueLabel = [ARCountdownView valueLabelWithSize:numberFontSize color:valueColor];
    self.hoursValueLabel = [ARCountdownView valueLabelWithSize:numberFontSize color:valueColor];
    self.minutesValueLabel = [ARCountdownView valueLabelWithSize:numberFontSize color:valueColor];
    self.secondsValueLabel = [ARCountdownView valueLabelWithSize:numberFontSize color:valueColor];

    NSArray<UILabel *> *valueLabels = @[ self.daysValueLabel, self.hoursValueLabel, self.minutesValueLabel, self.secondsValueLabel ];

    [valueLabels each:^(id label) {
        [self addSubview:label];
        [label constrainTopSpaceToView:self.headingLabel predicate:interitemSpacing];
    }];

    // Add colons and inter-item constraints.
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


    // Add unit labels under the number labels
    NSArray<NSString *> *units = @[ @"DAYS", @"HRS", @"MIN", @"SEC" ];

    UIColor *unitColor = self.color ?: [UIColor artsyGraySemibold];
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

#pragma mark - Overridden properties

- (void)setHeading:(NSString *)heading
{
    _heading = [heading copy];
    self.headingLabel.text = [heading uppercaseString];
}

#pragma mark - Public methods

- (void)startTimer
{
    if (self.timer) {
        // Timer is already running, return.
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

#pragma mark - Private timer-related methods

- (void)tick:(NSTimer *)timer
{
    [self updateCountdown];
}

- (void)updateCountdown
{
    NSDate *now = [ARSystemTime date];
    if ([now compare:self.targetDate] != NSOrderedAscending) {
        [self stopTimer];
        [self.delegate countdownViewDidFinish:self];
        [self updateDays:0 hours:0 minutes:0 seconds:0];
        return;
    }
    NSCalendar *calendar = [NSCalendar currentCalendar];
    NSCalendarUnit dhms = NSCalendarUnitDay | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond;
    NSDateComponents *components = [calendar components:dhms
                                               fromDate:now
                                                 toDate:self.targetDate
                                                options:0];
    [self updateDays:components.day hours:components.hour minutes:components.minute seconds:components.second];
}

- (void)updateDays:(NSInteger)days hours:(NSInteger)hours minutes:(NSInteger)minutes seconds:(NSInteger)seconds
{
    self.daysValueLabel.text = [self.formatter stringFromNumber:@(days)];
    self.hoursValueLabel.text = [self.formatter stringFromNumber:@(hours)];
    self.minutesValueLabel.text = [self.formatter stringFromNumber:@(minutes)];
    self.secondsValueLabel.text = [self.formatter stringFromNumber:@(seconds)];
}

#pragma mark - Private class methods

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
