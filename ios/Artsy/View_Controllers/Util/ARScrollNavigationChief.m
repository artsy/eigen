#import "ARScrollNavigationChief.h"

#import "ARMacros.h"

typedef NS_ENUM(NSInteger, ARScrollDirection) {
    ARScrollDirectionUp = -1,
    ARScrollDirectionNeutral,
    ARScrollDirectionDown
};

static ARScrollNavigationChief *instance;


@interface ARScrollNavigationChief ()

@property (nonatomic, assign) enum ARScrollDirection lastDirection;
@property (nonatomic, assign) CGFloat lastOffset;
@property (nonatomic, assign) CGFloat initialUpwardOffset;
@property (nonatomic, strong) UIScrollView *currentScrollView;

@property (readwrite, nonatomic, assign) BOOL allowsMenuButtons;

@end


@implementation ARScrollNavigationChief

+ (ARScrollNavigationChief *)chief
{
    static ARScrollNavigationChief *instance;

    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[ARScrollNavigationChief alloc] init];
    });

    return instance;
}

+ (ARScrollNavigationChief *)getChief
{
    return [self chief];
}

- (id)init
{
    self = [super init];
    if (self == nil) {
        return nil;
    }

    _allowsMenuButtons = YES;

    return self;
}

+ (BOOL)automaticallyNotifiesObserversOfAllowsMenuButtons
{
    return NO;
}

- (void)setAllowsMenuButtons:(BOOL)allowsMenuButtons
{
    if (_allowsMenuButtons == allowsMenuButtons) {
        return;
    }

    [self willChangeValueForKey:ar_keypath(self, allowsMenuButtons)];
    _allowsMenuButtons = allowsMenuButtons;
    [self didChangeValueForKey:ar_keypath(self, allowsMenuButtons)];
}

- (void)setChiefsTargetScrollView:(UIScrollView *)view
{
    if (view != self.currentScrollView) {
        self.currentScrollView = view;
        self.lastDirection = ARScrollDirectionUp;
        self.lastOffset = 0;
    }
}

- (BOOL)changedDirection:(UIScrollView *)scrollView newDirection:(ARScrollDirection *)newDirection
{
    if (self.lastDirection == ARScrollDirectionNeutral) {
        *newDirection = ARScrollDirectionDown;
        return YES;
    }

    // If it's bouncing, we don't wanna act like it's a manual scroll
    CGFloat offset = scrollView.contentOffset.y;
    if (offset <= 0) {
        return NO;
    }

    CGFloat delta = offset - self.lastOffset;
    if (delta > 0) {
        *newDirection = ARScrollDirectionDown;
        return self.lastDirection == ARScrollDirectionUp;

    } else {
        *newDirection = ARScrollDirectionUp;
        return self.lastDirection == ARScrollDirectionDown;
    }
}

static CGFloat UpwardScrollDistanceForShowing = 160;

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    CGFloat offset = scrollView.contentOffset.y;

    // No thanks phantom messages from offscreen views
    if (!scrollView.superview) {
        return;
    }
    [self setChiefsTargetScrollView:scrollView];

    // When a scrollview *isn't* the root view on a VC
    if (offset == 0) {
        return;
    }

    // When a scrollview subclass is the root view on a VC
    if (offset == -20) {
        return;
    }

    // When we just can't scroll anyway
    if (scrollView.contentSize.height < scrollView.bounds.size.height) {
        return;
    }

    ARScrollDirection newDirection;

    // Parallax scroll views won't have a negative offset. Check for topHeight instead.
    BOOL isScrollingPastTopEdge = offset < 0;

    if ([self changedDirection:scrollView newDirection:&newDirection]) {
        if (newDirection == ARScrollDirectionUp) {
            // If we're going up, give ourselves an initial offset for gettng a distance
            self.initialUpwardOffset = scrollView.contentOffset.y;

        } else {
            self.initialUpwardOffset = NSNotFound;

            // Before we hide any buttons, we want to make sure this scroll view
            // can actually scroll
            if (!isScrollingPastTopEdge) {
                self.allowsMenuButtons = NO;
            }
        }
    }

    if (isScrollingPastTopEdge) {
        self.lastDirection = ARScrollDirectionUp;
    } else if (self.lastOffset == 0) {
        self.lastDirection = ARScrollDirectionDown;
    } else {
        CGFloat delta = offset - self.lastOffset;
        self.lastDirection = delta > 0 ? ARScrollDirectionDown : ARScrollDirectionUp;
    }

    // if we do see if we've scrolled past the threshold to show
    BOOL setAnOffset = self.initialUpwardOffset != NSNotFound;
    // TODO rename me
    BOOL whatever = !scrollView.isDecelerating && (setAnOffset && offset < self.initialUpwardOffset - UpwardScrollDistanceForShowing);
    if (isScrollingPastTopEdge || whatever) {
        self.allowsMenuButtons = YES;
    }

    self.lastOffset = offset;
}

@end
