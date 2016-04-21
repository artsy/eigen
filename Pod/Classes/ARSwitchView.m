//
// IMPORTANT: This is a hacked version of Eigen, before trying to use Emission in Eigen this should be sorted out.
//

#import "ARSwitchView.h"

//#import "ARAppConstants.h"
@import Artsy_UIFonts;

#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

static BOOL ARPerformWorkAsynchronously = YES;
static CGFloat ARAnimationQuickDuration = 0.15;

@interface ARSwitchView ()
@property (nonatomic, copy, readwrite) NSArray<UIButton *> *buttons;
@property (nonatomic, copy, readwrite) NSArray<NSLayoutConstraint *> *selectionIndicatorConstraints;
@property (nonatomic, strong, readonly) UIView *buttonContainer;
@property (nonatomic, strong, readonly) UIView *selectionIndicator;
@property (nonatomic, strong, readonly) UIView *topSelectionIndicator;
@property (nonatomic, strong, readonly) UIView *bottomSelectionIndicator;
@end


@implementation ARSwitchView

// Light grey = background, visible by the buttons being a bit smaller than full size
// black bit that moves = uiviews

- (instancetype)init;
{
  return [self initWithButtonTitles:@[]];
}

- (instancetype)initWithButtonTitles:(NSArray<NSString *> *)titles
{
  self = [super initWithFrame:CGRectMake(0, 0, 0, self.intrinsicContentSize.height)];
  if (!self) {
    return nil;
  }

  [self createSelectionIndicator];

  _buttonContainer = [[UIView alloc] init];
  [self addSubview:_buttonContainer];

  [_buttonContainer alignLeading:@"0" trailing:@"0" toView:self];
  [_buttonContainer alignAttribute:NSLayoutAttributeTop
                       toAttribute:NSLayoutAttributeBottom
                            ofView:self.topSelectionIndicator
                         predicate:@"0"];
  [_buttonContainer alignAttribute:NSLayoutAttributeBottom
                       toAttribute:NSLayoutAttributeTop
                            ofView:self.bottomSelectionIndicator
                         predicate:@"0"];

  self.titles = titles;

  return self;
}

- (NSArray<NSString *> *)titles;
{
  NSArray<UIButton *> *buttons = self.buttons ?: @[];
  // TODO Does this actually work? Do we really need it?
  return [buttons valueForKey:@"title"];
}

- (void)setTitles:(NSArray<NSString *> *)titles;
{
  if (self.buttons) {
    [self.buttons makeObjectsPerformSelector:@selector(removeFromSuperview)];
  }

  if (titles.count == 0) {
    _selectedIndex = 0;
    self.buttons = @[];
    self.selectionIndicatorConstraints = @[];
    return;
  }

  NSMutableArray *selectionIndicatorConstraints = [[NSMutableArray alloc] initWithCapacity:titles.count];
  NSMutableArray *buttons = [[NSMutableArray alloc] initWithCapacity:titles.count];

  for (NSString *title in titles) {
    UIButton *button = [self createButtonWithTitle:title];
    [self.buttonContainer addSubview:button];
    [buttons addObject:button];

    // These constraints will be activated and deactivated to move the indicator.
    NSLayoutConstraint *indicatorConstraint = [self.selectionIndicator alignLeadingEdgeWithView:button predicate:@"0"];
    [selectionIndicatorConstraints addObject:indicatorConstraint];
  };

  self.buttons = buttons;
  self.selectionIndicatorConstraints = selectionIndicatorConstraints;
  [NSLayoutConstraint deactivateConstraints:self.selectionIndicatorConstraints];

  [self.buttons.firstObject alignLeadingEdgeWithView:self.buttonContainer predicate:@"0"];
  [self.buttons.lastObject alignTrailingEdgeWithView:self.buttonContainer predicate:@"0"];

  [UIView spaceOutViewsHorizontally:self.buttons predicate:@"0"];
  [UIView alignTopAndBottomEdgesOfViews:[self.buttons arrayByAddingObject:self.buttonContainer]];
  [UIView equalWidthForViews:[self.buttons arrayByAddingObject:self.selectionIndicator]];

  // Try to maintain the selection. With React Native this allows us to change a
  // title at runtime without resetting the selection.
  if (self.selectedIndex < titles.count) {
    self.selectedIndex = self.selectedIndex;
  } else {
    self.selectedIndex = 0;
  }
}

- (void)createSelectionIndicator
{
  CGFloat indicatorThickness = 2;

  _selectionIndicator = [[UIView alloc] init];
  _topSelectionIndicator = [[UIView alloc] init];
  _bottomSelectionIndicator = [[UIView alloc] init];

  self.topSelectionIndicator.backgroundColor = [UIColor blackColor];
  self.bottomSelectionIndicator.backgroundColor = [UIColor blackColor];
//  self.backgroundColor = [UIColor artsyGrayMedium];
  self.backgroundColor = [UIColor lightGrayColor];

  [self.selectionIndicator addSubview:self.topSelectionIndicator];
  [self.selectionIndicator addSubview:self.bottomSelectionIndicator];

  [self.topSelectionIndicator alignLeading:@"0" trailing:@"0" toView:self.selectionIndicator];
  [self.topSelectionIndicator alignTopEdgeWithView:self.selectionIndicator predicate:@"0"];
  [self.topSelectionIndicator constrainHeight:@(indicatorThickness).stringValue];

  [self.bottomSelectionIndicator alignLeading:@"0" trailing:@"0" toView:self.selectionIndicator];
  [self.bottomSelectionIndicator alignBottomEdgeWithView:self.selectionIndicator predicate:@"0"];
  [self.bottomSelectionIndicator constrainHeight:@(indicatorThickness).stringValue];

  [self insertSubview:self.selectionIndicator atIndex:0];
  [self.selectionIndicator alignTop:@"0" bottom:@"0" toView:self];
}

- (void)selectedButton:(UIButton *)sender
{
  NSInteger buttonIndex = [self.buttons indexOfObject:sender];
  [self setSelectedIndex:buttonIndex animated:ARPerformWorkAsynchronously];
}

- (UIButton *)createButtonWithTitle:(NSString *)title
{
  UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];

  [button setTitle:title forState:UIControlStateNormal];
  [button setTitle:title forState:UIControlStateDisabled];
  [button addTarget:self action:@selector(selectedButton:) forControlEvents:UIControlEventTouchUpInside];

  button.titleLabel.font = [UIFont sansSerifFontWithSize:14];
  button.titleLabel.backgroundColor = [UIColor whiteColor];
  button.titleLabel.opaque = YES;
  button.backgroundColor = [UIColor whiteColor];

  [button setTitleColor:[UIColor blackColor] forState:UIControlStateDisabled];
  [button setTitleColor:[UIColor blackColor] forState:UIControlStateSelected];
//  [button setTitleColor:[UIColor artsyGraySemibold] forState:UIControlStateNormal];
  [button setTitleColor:[UIColor grayColor] forState:UIControlStateNormal];

  return button;
}

- (CGSize)intrinsicContentSize
{
  return (CGSize){UIViewNoIntrinsicMetric, 46};
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
  _selectedIndex = index;

  [UIView animateIf:ARPerformWorkAsynchronously && animated duration:ARAnimationQuickDuration options:UIViewAnimationOptionCurveEaseOut:^{
    UIButton *button = self.buttons[index];

    [self.buttons each:^(UIButton *button) {
      [self highlightButton:button highlighted:NO];
    }];

    [self highlightButton:button highlighted:YES];

    [NSLayoutConstraint deactivateConstraints:self.selectionIndicatorConstraints];
    [NSLayoutConstraint activateConstraints:@[self.selectionIndicatorConstraints[index]]];

    [self layoutIfNeeded];
  }];

  [self.delegate switchView:self didPressButtonAtIndex:index animated:ARPerformWorkAsynchronously && animated];
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

  [UIView animateIf:ARPerformWorkAsynchronously && animated duration:ARAnimationQuickDuration:^{
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
