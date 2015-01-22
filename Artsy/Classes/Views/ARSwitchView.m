#import "ARSwitchView.h"

@interface ARSwitchView()
@property (nonatomic, strong, readwrite) NSLayoutConstraint *selectionConstraint;
@property (nonatomic, strong, readwrite) NSArray *buttons;
@property (nonatomic, strong, readonly) UIView *selectionIndicator;
@property (nonatomic, strong, readonly) UIView *topSelectionIndicator;
@property (nonatomic, strong, readonly) UIView *bottomSelectionIndicator;
@end

@implementation ARSwitchView

// Light grey = background, visible by the buttons being a bit smaller than full size
// black bit that moves = uiviews

- (instancetype)init
{
    self = [super init];
    if (!self) { return nil; }
    _shouldAnimate = YES;
    return self;
}

- (instancetype)initWithButtonTitles:(NSArray *)buttonTitlesArray
{
    self = [self init];
    if (!self) { return nil; }

    __block NSInteger index = 0;
    _buttons = [buttonTitlesArray map:^id(id object) {
        UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
        [self setupButton:button];
        [button setTitle:object forState:UIControlStateNormal];
        [button setTitle:object forState:UIControlStateDisabled];
        [button addTarget:self action:@selector(selectedButton:) forControlEvents:UIControlEventTouchUpInside];

        if (index == 0) {
            [button setEnabled:NO];
        }

        index++;
        return button;
    }];

    NSString *widthPredicateWithMultiplier = NSStringWithFormat(@"*%f", self.widthMultiplier);

    [self.buttons eachWithIndex:^(UIButton *button, NSUInteger index) {
        [self addSubview:button];
        [button constrainWidthToView:self predicate:widthPredicateWithMultiplier];
        if (index == 0) {
            [button alignLeadingEdgeWithView:self predicate:nil];
        } else {
            [button constrainLeadingSpaceToView:self.buttons[index - 1] predicate:nil];
        }
        [button alignTop:@"2" bottom:@"-2" toView:self];
    }];

    _selectionIndicator = [[UIView alloc] init];
    _topSelectionIndicator = [[UIView alloc] init];
    _bottomSelectionIndicator = [[UIView alloc] init];

    self.topSelectionIndicator.backgroundColor = [UIColor blackColor];
    self.bottomSelectionIndicator.backgroundColor = [UIColor blackColor];
    self.backgroundColor = [UIColor artsyMediumGrey];

    [self.selectionIndicator addSubview:self.topSelectionIndicator];
    [self.selectionIndicator addSubview:self.bottomSelectionIndicator];

    [self.topSelectionIndicator alignTop:@"0" leading:@"0" bottom:nil trailing:@"0" toView:self.selectionIndicator];
    [self.bottomSelectionIndicator alignTop:nil leading:@"0" bottom:@"0" trailing:@"0" toView:self.selectionIndicator];

    [self.topSelectionIndicator constrainHeight:@"2"];
    [self.bottomSelectionIndicator constrainHeight:@"2"];

    [self insertSubview:self.selectionIndicator atIndex:0];
    [self.selectionIndicator constrainWidthToView:self predicate:widthPredicateWithMultiplier];
    [self.selectionIndicator alignTop:@"0" bottom:@"0" toView:self];

    _selectionConstraint = [[self.selectionIndicator alignLeadingEdgeWithView:self predicate:nil] lastObject];

    return self;
}

- (CGFloat)widthMultiplier
{
    return 1.0 / self.buttons.count;
}

- (void)selectedButton:(UIButton *)sender
{
    NSInteger buttonIndex = [self.buttons indexOfObject:sender];
    [self setSelectedIndex:buttonIndex animated:self.shouldAnimate];
}

- (void)setupButton:(UIButton *)button
{
    button.titleLabel.font = [UIFont sansSerifFontWithSize:14];
    button.titleLabel.backgroundColor = [UIColor whiteColor];
    button.titleLabel.opaque = YES;
    button.backgroundColor = [UIColor whiteColor];

    [button setTitleColor:[UIColor blackColor] forState:UIControlStateDisabled];
    [button setTitleColor:[UIColor blackColor] forState:UIControlStateSelected];
    [button setTitleColor:[UIColor artsyHeavyGrey] forState:UIControlStateNormal];
}

- (CGSize)intrinsicContentSize
{
    return (CGSize){ UIViewNoIntrinsicMetric, 46 };
}

- (void)setTitle:(NSString *)title forButtonAtIndex:(NSInteger)index
{
    NSAssert(index >= 0, @"Index must be >= zero. ");
    NSAssert(index < self.buttons.count, @"Index exceeds buttons count. ");

    [self.buttons[index] setTitle:title forState:UIControlStateNormal];
    [self.buttons[index] setTitle:title forState:UIControlStateDisabled];
}

- (void)setSelectedIndex:(NSInteger)index
{
    [self setSelectedIndex:index animated:NO];
}

- (void)setSelectedIndex:(NSInteger)index animated:(BOOL)animated
{
    [UIView animateIf:self.shouldAnimate && animated duration:ARAnimationQuickDuration options:UIViewAnimationOptionCurveEaseOut :^{
        UIButton *button = self.buttons[index];

        [self.buttons each:^(UIButton *button) {
            [self highlightButton:button highlighted:NO];
        }];

        [self highlightButton:button highlighted:YES];
        
        // Set the x-position of the selection indicator as a fraction of the total width of the switch view according to which button was pressed.
        double buttonIndex = [[NSNumber numberWithInteger:[self.buttons indexOfObject:button]] doubleValue];
        double buttonCount = [[NSNumber numberWithInteger:self.buttons.count] doubleValue];
        double multiplier =  buttonIndex/buttonCount;
        [self removeConstraint:self.selectionConstraint];

        // Must be a constraint with a multiple rather than a numerical value so that position is updated if switchview width changes.
        self.selectionConstraint = [NSLayoutConstraint constraintWithItem:self.selectionIndicator
                                                                attribute:NSLayoutAttributeLeft
                                                                relatedBy:NSLayoutRelationEqual
                                                                   toItem:self
                                                                attribute:NSLayoutAttributeRight
                                                               multiplier:multiplier
                                                                 constant:0];

        [self addConstraint:self.selectionConstraint];
        [self layoutIfNeeded];
    }];

    [self.delegate switchView:self didPressButtonAtIndex:index animated:self.shouldAnimate && animated];
}

- (void)highlightButton:(UIButton *)button highlighted:(BOOL)highlighted
{
    if (self.preferHighlighting) {
        button.selected = highlighted;
    } else {
        button.enabled = !highlighted;
    }
}

- (void)setEnabledStates:(NSArray *)enabledStates
{
    [self setEnabledStates:enabledStates animated:NO];
}

- (void)setEnabledStates:(NSArray *)enabledStates animated:(BOOL)animated
{
    NSAssert(enabledStates.count == self.buttons.count, @"Need to have a consistent number of enabled states for buttons");

    [UIView animateIf:self.shouldAnimate && animated duration:ARAnimationQuickDuration :^{
        for (NSInteger i = 0; i < self.enabledStates.count; i++) {
            UIButton *button = self.buttons[i];
            BOOL enabled = [self.enabledStates[i] boolValue];

            if (!enabled) {
                button.enabled = NO;
                button.alpha = 0.3;
            } else {
                button.alpha = 1;
            }
        }
    }];
}

- (void)setPreferHighlighting:(BOOL)preferHighlighting
{
    _preferHighlighting = preferHighlighting;
    
    [self.buttons each:^(UIButton *button) {
        if (!button.isEnabled || button.isHighlighted) {
            button.enabled = preferHighlighting;
            button.selected = !preferHighlighting;
        }
    }];
}

@end
