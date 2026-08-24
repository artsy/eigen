#import "AROfflineView.h"

#import "ARFonts.h"
#import "ORStackView+ArtsyViews.h"

#import <objc/message.h>
#import "ARButtonSubclasses.h"
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

@interface AROfflineView ()
@property (readonly, nonatomic, strong) ARMenuButton *refreshButton;
@property (readwrite, nonatomic, assign) BOOL stopRotating;
@end


@implementation AROfflineView

- (instancetype)initWithFrame:(CGRect)frame;
{
    if ((self = [super initWithFrame:frame])) {
        self.backgroundColor = [UIColor whiteColor];

        ORStackView *stackView = [ORStackView new];
        stackView.backgroundColor = [UIColor whiteColor];

        [@[
            [stackView addPageTitleWithString:NSLocalizedString(@"Can’t Connect", @"Offline mode view title")],
            [stackView addSerifPageSubtitle:NSLocalizedString(@"Check your network and try again", @"Offline mode view subtitle")],
        ] each:^(UILabel *label) {
            label.textColor = [UIColor artsyGraySemibold];
        }];

        UIImage *buttonIcon = [UIImage imageNamed:@"RefreshIcon"];
        _refreshButton = [ARMenuButton new];
        [_refreshButton setBorderColor:[UIColor artsyGrayRegular] forState:UIControlStateNormal animated:NO];
        [_refreshButton setBackgroundColor:[UIColor whiteColor] forState:UIControlStateNormal animated:NO];
        [_refreshButton setImage:buttonIcon forState:UIControlStateNormal];
        [_refreshButton addTarget:self action:@selector(forceRefreshFeedItems:) forControlEvents:UIControlEventTouchUpInside];
        _refreshButton.adjustsImageWhenDisabled = NO;

        UIView *buttonContainer = [UIView new];
        [buttonContainer addSubview:_refreshButton];
        [buttonContainer constrainHeightToView:_refreshButton predicate:@"0"];
        [_refreshButton alignCenterWithView:buttonContainer];
        [stackView addSubview:buttonContainer withTopMargin:@"20" sideMargin:@"0"];

        [self addSubview:stackView];

        // FLKAutoLayout sets this for us, native anchors do not. We need native anchors here because
        // alignCenterWithView: only takes a UIView, and safeAreaLayoutGuide is a UILayoutGuide.
        stackView.translatesAutoresizingMaskIntoConstraints = NO;

        UILayoutGuide *safeAreaLayoutGuide = self.safeAreaLayoutGuide;
        [NSLayoutConstraint activateConstraints:@[
            [stackView.centerXAnchor constraintEqualToAnchor:safeAreaLayoutGuide.centerXAnchor],
            [stackView.centerYAnchor constraintEqualToAnchor:safeAreaLayoutGuide.centerYAnchor],
            // Keep the title and subtitle clear of the rounded corners and sensor housing in landscape.
            [stackView.leadingAnchor constraintGreaterThanOrEqualToAnchor:safeAreaLayoutGuide.leadingAnchor constant:20],
            [stackView.trailingAnchor constraintLessThanOrEqualToAnchor:safeAreaLayoutGuide.trailingAnchor constant:-20],
        ]];
    }
    return self;
}

- (IBAction)forceRefreshFeedItems:(id)sender;
{
    [self rotate];
    [self.delegate offlineViewDidRequestRefresh:self];
}

// Only need to rotate half way, because the icon is symetrical.
- (void)rotate;
{
    self.refreshButton.transform = CGAffineTransformIdentity;
    [UIView animateKeyframesWithDuration:1.0
        delay:0.0
        options:UIViewKeyframeAnimationOptionCalculationModePaced | UIViewAnimationOptionCurveLinear
        animations:^{
                                  [UIView addKeyframeWithRelativeStartTime:0.0 relativeDuration:0.0 animations:^{
                                    self.refreshButton.transform = CGAffineTransformMakeRotation(M_PI * 2.0 / 3.0);
                                  }];
                                  [UIView addKeyframeWithRelativeStartTime:0.0 relativeDuration:0.0 animations:^{
                                    self.refreshButton.transform = CGAffineTransformMakeRotation(M_PI * 4.0 / 3.0);
                                  }];
                                  [UIView addKeyframeWithRelativeStartTime:0.0 relativeDuration:0.0 animations:^{
                                    self.refreshButton.transform = CGAffineTransformIdentity;
                                  }];
        }
        completion:^(BOOL _) {
        if (self.stopRotating) {
            self.stopRotating = NO;
        } else {
            [self rotate];
        }
        }];
}

// Don’t immediately stop the animation, instead let it do a full rotation so that the user has the feeling we at least
// tried when a connection fails immediately again.

- (void)refreshFailed;
{
    self.stopRotating = YES;
}

@end
