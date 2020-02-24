#import "AROnboardingNavigationItemsView.h"
#import "UIColor+ArtsyColors.h"

#import "ARFonts.h"
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <Extraction/ARSpinner.h>


@interface AROnboardingNavigationItemsView ()

@property (nonatomic, strong) UILabel *warningLabel;
@property (nonatomic, strong) NSLayoutConstraint *warningLabelHeightConstraint;
@property (nonatomic, strong) NSLayoutConstraint *nextWidthConstraintHalf;
@property (nonatomic, strong) NSLayoutConstraint *nextWidthConstraintFull;
@property (nonatomic, strong) UIView *separatorBorder;
@property (nonatomic, strong) UIView *spinnerView;
@property (nonatomic, strong) ARSpinner *spinner;
@end


@implementation AROnboardingNavigationItemsView

- (instancetype)init
{
    self = [super init];
    if (self) {

        _back = [[ARWhiteFlatButton alloc] init];
        [self.back setTitle:@"Back" forState:UIControlStateNormal];
        
        _next = [[ARWhiteFlatButton alloc] init];
        [self.next setTitle:@"Next" forState:UIControlStateNormal];
        
        UIView *topBorder = [[UIView alloc] init];
        self.separatorBorder = [[UIView alloc] init];
        topBorder.backgroundColor = [UIColor artsyGrayRegular];
        self.separatorBorder.backgroundColor = [UIColor artsyGrayRegular];
        
        [self addSubview:self.back];
        [self addSubview:self.next];
        [self addSubview:topBorder];
        [self addSubview:self.separatorBorder];
        
        [topBorder constrainHeight:@"0.5"];
        [topBorder constrainWidthToView:self predicate:@"0"];
        [topBorder alignTop:@"0" leading:@"0" toView:self];
        
        [self.separatorBorder constrainWidth:@"0.5"];
        [self.separatorBorder constrainHeightToView:self predicate:@"0"];
        [self.separatorBorder alignCenterWithView:self];
        
        [self.back alignBottomEdgeWithView:self predicate:@"0"];
        [self.back alignLeadingEdgeWithView:self predicate:@"0"];
        [self.back constrainWidthToView:self predicate:@"*.5"];
        [self.back constrainHeight:@"50"];
        
        self.back.hidden = YES;
        self.separatorBorder.hidden = YES;
        
        [self.next alignBottomEdgeWithView:self predicate:@"0"];
        [self.next alignTrailingEdgeWithView:self predicate:@"0"];
        self.nextWidthConstraintFull = [self.next constrainWidthToView:self predicate:@"1"];
        self.nextWidthConstraintHalf = [self.next constrainWidthToView:self predicate:@"*.5"];
        self.nextWidthConstraintHalf.active = NO;
        [self.next constrainHeight:@"50"];

        self.warningLabel = [[UILabel alloc] init];
        self.warningLabel.font = [UIFont serifFontWithSize:15.0];
        self.warningLabel.textAlignment = NSTextAlignmentCenter;

        [self addSubview:self.warningLabel];

        [self.warningLabel alignBottomEdgeWithView:self predicate:@"0"];
        [self.warningLabel alignLeadingEdgeWithView:self predicate:@"0"];
        [self.warningLabel constrainWidthToView:self predicate:@"0"];
        [self.warningLabel constrainHeight:@"50"];
        
        self.warningLabel.hidden = YES;
        
        self.spinnerView = [[UIView alloc] init];
        self.spinnerView.backgroundColor = [UIColor blackColor];
        
        self.spinner = [[ARSpinner alloc] init];
        self.spinner.spinnerColor = [UIColor whiteColor];
        
        [self addSubview:self.spinnerView];
        [self.spinnerView addSubview:self.spinner];
        
        [self.spinner alignCenterWithView:self.spinnerView];
        
        [self.spinnerView alignBottomEdgeWithView:self predicate:@"0"];
        [self.spinnerView alignLeadingEdgeWithView:self predicate:@"0"];
        [self.spinnerView constrainWidthToView:self predicate:@"0"];
        [self.spinnerView constrainHeight:@"50"];
        
        self.spinnerView.hidden = YES;
    }

    return self;
}

- (void)addBackButton
{
    self.back.hidden = NO;
    self.separatorBorder.hidden = NO;
    self.nextWidthConstraintFull.active = NO;
    self.nextWidthConstraintHalf.active = YES;
}

- (void)hideBackButton
{
    self.back.hidden = YES;
    self.separatorBorder.hidden = YES;
    self.nextWidthConstraintHalf.active = NO;
    self.nextWidthConstraintFull.active = YES;
}

- (void)disableNextStep
{
    [self.next setTitleColor:[UIColor artsyGrayMedium] forState:UIControlStateNormal];
    [self.next setBackgroundColor:[UIColor whiteColor] forState:UIControlStateNormal];
    
    [self.next setTitleColor:[UIColor whiteColor] forState:UIControlStateHighlighted];
    [self.next setBackgroundColor:[UIColor blackColor] forState:UIControlStateHighlighted];
    
    self.next.enabled = NO;
}

- (void)enableNextStep
{
    [self.next setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [self.next setBackgroundColor:[UIColor blackColor] forState:UIControlStateNormal];
    
    [self.next setTitleColor:[UIColor blackColor] forState:UIControlStateHighlighted];
    [self.next setBackgroundColor:[UIColor whiteColor] forState:UIControlStateHighlighted];
    self.next.enabled = YES;
}

- (void)defaultNextStep
{
    [self.next setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [self.next setBackgroundColor:[UIColor whiteColor] forState:UIControlStateNormal];
    
    [self.next setTitleColor:[UIColor whiteColor] forState:UIControlStateHighlighted];
    [self.next setBackgroundColor:[UIColor blackColor] forState:UIControlStateHighlighted];
    self.next.enabled = YES;
}


- (void)showWarning:(NSString *)text
{
    [self hideSpinner];
    
    self.warningLabel.text = text;
    
    self.warningLabel.backgroundColor = [UIColor artsyYellowRegular];
    self.warningLabel.textColor = [UIColor artsyYellowBold];
    
    self.warningLabel.hidden = NO;
    self.next.enabled = NO;
}

- (void)hideWarning
{
    self.warningLabel.hidden = YES;
    self.next.enabled = YES;
}

- (void)showError:(NSString *)text
{
    [self hideSpinner];

    // Allow short messages to be shown in the bottom button.
    if (text.length < 25) {
        self.warningLabel.text = text;
        self.warningLabel.backgroundColor = [UIColor artsyRedRegular];
        self.warningLabel.textColor = [UIColor whiteColor];

        self.warningLabel.hidden = NO;
        self.next.enabled = NO;
    } else {
        UIViewController *presentingController = [[[UIApplication sharedApplication] keyWindow] rootViewController];

        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"Error" message:text preferredStyle:UIAlertControllerStyleAlert];
        [alert addAction:[UIAlertAction actionWithTitle:@"Okay" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            [presentingController dismissViewControllerAnimated:YES completion:nil];
        }]];
        [presentingController presentViewController:alert animated:YES completion:nil];
    }
}

- (void)hideError
{
    self.warningLabel.hidden = YES;
    self.next.enabled = YES;
}

- (void)showSpinner
{
    [self.spinner startAnimating];
    self.spinnerView.hidden = NO;
    self.next.enabled = NO;
    
}

- (void)hideSpinner
{
    [self.spinner stopAnimating];
    self.spinnerView.hidden = YES;
    self.next.enabled = YES;
}


@end
