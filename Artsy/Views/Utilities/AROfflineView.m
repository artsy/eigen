#import "AROfflineView.h"
#import "ORStackView+ArtsyViews.h"

#import <objc/message.h>


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
            label.textColor = [UIColor artsyHeavyGrey];
        }];

        UIImage *buttonIcon = [UIImage imageNamed:@"SearchButton"];
        _refreshButton = [ARMenuButton new];
        // [button ar_extendHitTestSizeByWidth:10 andHeight:10];
        [_refreshButton setImage:buttonIcon forState:UIControlStateNormal];
        [_refreshButton addTarget:self action:@selector(forceRefreshFeedItems:) forControlEvents:UIControlEventTouchUpInside];
        _refreshButton.adjustsImageWhenDisabled = NO;

        UIView *buttonContainer = [UIView new];
        [buttonContainer addSubview:_refreshButton];
        [buttonContainer constrainHeightToView:_refreshButton predicate:nil];
        [_refreshButton alignCenterWithView:buttonContainer];
        [stackView addSubview:buttonContainer withTopMargin:@"20" sideMargin:@"0"];

        [self addSubview:stackView];
        [stackView alignCenterWithView:self];
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
    [UIView animateWithDuration:1
        delay:0
        options:UIViewAnimationOptionCurveLinear
        animations:^{ self.refreshButton.transform = CGAffineTransformMakeRotation(M_PI);
        }
        completion:^(BOOL _) {
        self.refreshButton.transform = CGAffineTransformIdentity;
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
