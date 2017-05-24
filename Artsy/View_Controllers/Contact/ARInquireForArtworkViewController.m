#import <Adjust/Adjust.h>
#import <ALPValidator/ALPValidator.h>
#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <Artsy_UIButtons/ARButtonSubclasses.h>

#import "Artist.h"
#import "Artwork.h"
#import "ArtsyAPI+SiteFunctions.h"
#import "ARInquireForArtworkViewController.h"
#import "ARUserManager.h"
#import "UIViewController+ScreenSize.h"
#import "UIView+HittestExpansion.h"
#import "ARAppDelegate.h"
#import "ARAnalyticsConstants.h"
#import "ARFonts.h"
#import "Partner.h"
#import "Profile.h"
#import "ARSeparatorViews.h"
#import "ARTheme.h"
#import "ARTopMenuViewController.h"
#import "ARLogger.h"

#import "UIImage+ImageFromColor.h"
#import "UIImageView+AsyncImageLoading.h"
#import "UIDevice-Hardware.h"
#import "UIApplication+StatusBar.h"

#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

// Future TODO: Don't use image alpha on contact image, use grayscale'd image.

// The state of the form, for enabling / disabling
typedef NS_ENUM(NSInteger, ARInquireFormState) {
    ARInquireFormStateSendable,
    ARInquireFormStateSending,
    ARInquireFormStateSent,
    ARInquireFormStateCancelled
};


@interface ARInquireForArtworkViewController () <UITextFieldDelegate>

@property (nonatomic, assign) enum ARInquireState state;
@property (nonatomic, strong) Artwork *artwork;
@property (nonatomic, strong) User *user;


@property (nonatomic, strong) UIViewController *hostController;
@property (nonatomic, strong) NSString *inquiryURLRepresentation;

@property (nonatomic, strong, readonly) UIView *inquiryFormView;
@property (nonatomic, strong, readonly) UIView *topMenuView;
@property (nonatomic, strong, readonly) UIView *specialistView;
@property (nonatomic, strong, readonly) UIView *artworkView;
@property (nonatomic, strong, readonly) UIView *contentSeparator;
@property (nonatomic, strong, readonly) UIView *nameEmailForm;
@property (nonatomic, strong, readonly) UITextField *nameInput;
@property (nonatomic, strong, readonly) UITextField *emailInput;
@property (nonatomic, strong, readonly) ALPValidator *emailValidator;
@property (nonatomic, strong, readonly) UIScrollView *contentView;
@property (nonatomic, strong, readonly) UIView *backgroundView;
@property (nonatomic, strong, readonly) UIView *topContainer;

@property (nonatomic, strong, readonly) ARModalMenuButton *cancelButton;
@property (nonatomic, strong, readonly) ARModalMenuButton *sendButton;

@property (nonatomic, strong, readonly) UILabel *messageTitleLabel;
@property (nonatomic, strong, readonly) UILabel *messageBodyLabel;
@property (nonatomic, strong, readonly) UIButton *failureDismissButton;
@property (nonatomic, strong, readonly) UIButton *failureTryAgainButton;

@property (nonatomic, strong, readonly) UITextView *textView;
@property (nonatomic, strong, readonly) UILabel *userSignature;

@property (nonatomic, strong, readonly) UIImageView *specialistHeadImage;
@property (nonatomic, strong, readonly) UILabel *specialistNameLabel;

@property (nonatomic, strong, readonly) UIView *viewBehindKeyboard;
@property (nonatomic, strong, readonly) NSLayoutConstraint *keyboardHeightConstraint;
@property (nonatomic, strong, readonly) NSLayoutConstraint *keyboardPositionConstraint;
@property (nonatomic, strong, readonly) NSLayoutConstraint *inquiryHeightConstraint;
@property (nonatomic, strong, readonly) NSLayoutConstraint *hideInquiryConstraint;
// Private Access
@property (nonatomic, strong, readwrite) Fair *fair;

@end


@implementation ARInquireForArtworkViewController

- (instancetype)initWithAdminInquiryForArtwork:(Artwork *)artwork fair:(Fair *)fair
{
    self = [self init];

    _state = ARInquireStateRepresentative;
    _artwork = artwork;
    self.fair = fair;

    [self getCurrentAdmin];

    return self;
}

- (instancetype)initWithPartnerInquiryForArtwork:(Artwork *)artwork fair:(Fair *)fair
{
    self = [self init];

    _state = ARInquireStatePartner;
    _artwork = artwork;
    self.fair = fair;

    return self;
}

- (void)presentFormWithInquiryURLRepresentation:(NSString *)inquiryURLRepresentation
{
    NSParameterAssert(inquiryURLRepresentation);
    UIViewController *hostController = [ARTopMenuViewController sharedController];
    self.inquiryURLRepresentation = inquiryURLRepresentation;
    self.modalPresentationCapturesStatusBarAppearance = YES;

    hostController.modalPresentationStyle = UIModalPresentationCurrentContext;
    self.modalPresentationStyle = UIModalPresentationOverCurrentContext;
    [hostController presentViewController:self animated:NO completion:nil];
}

- (void)removeFromHostViewController
{
    [[UIApplication sharedApplication] ar_setStatusBarHidden:NO];
    [self hideMessage];
    [self hideFailureButtons];
    [self fadeBackgroundVisible:NO];
    [self performSelector:@selector(dismissSelf) withObject:nil afterDelay:ARAnimationDuration];
}

- (void)dismissSelf
{
    [self.presentingViewController dismissViewControllerAnimated:NO completion:nil];
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (void)viewDidLoad
{
    self.view.backgroundColor = [UIColor clearColor];

    [[UIApplication sharedApplication] ar_setStatusBarHidden:self.smallScreen];
    self.view.backgroundColor = [UIColor clearColor];
    _backgroundView = [[UIView alloc] initWithFrame:CGRectZero];
    [self.view addSubview:self.backgroundView];

    // Make the background view a square equal to the longest dimension of self.view, regardless of orientation.
    // This is to ensure that the background view completely covers the view behind it when rotating.
    [self.backgroundView constrainWidthToView:self.view predicate:@">=0"];
    [self.backgroundView constrainHeightToView:self.view predicate:@">=0"];
    [self.backgroundView alignAttribute:NSLayoutAttributeHeight toAttribute:NSLayoutAttributeWidth ofView:self.backgroundView predicate:@"0"];

    [self.backgroundView alignCenterWithView:self.view];
    self.backgroundView.layer.backgroundColor = [UIColor blackColor].CGColor;
    self.backgroundView.layer.opacity = 0.0;
    self.view.backgroundColor = [UIColor clearColor];
    [self createBackground];
    [self createMessages];
    [self createTopMenu];

    if (!self.user) {
        [self createNameEmailForm];
    }

    if (!self.smallScreen && self.state == ARInquireStateRepresentative) {
        [self createArtsySpecialistSection];
    }

    [self createContentScrollView];
    [self createTextInputArea];
    [self createUserSignature];
    [self createContentSeparator];

    if (!self.smallScreen || self.state == ARInquireStatePartner) {
        [self createArtworkSection];
        [self.artworkView alignBottomEdgeWithView:self.inquiryFormView predicate:@"-10"];
    } else if (self.state == ARInquireStateRepresentative) {
        [self createArtsySpecialistSection];
        [self.specialistView alignBottomEdgeWithView:self.inquiryFormView predicate:@"-10"];
    }

    // ensure all the layout is done before we animate in the view controller
    [self.view layoutIfNeeded];

    [super viewDidLoad];
}

- (void)createMessages
{
    ARTheme *theme = [ARTheme themeNamed:@"InquireForm"];

    UILabel *titleLabel = [[UILabel alloc] init];
    titleLabel.font = theme.fonts[@"BackgroundTitle"];
    titleLabel.textAlignment = NSTextAlignmentCenter;
    titleLabel.textColor = [UIColor whiteColor];
    [self.view addSubview:titleLabel];
    [titleLabel alignAttribute:NSLayoutAttributeTop toAttribute:NSLayoutAttributeCenterY ofView:self.view predicate:@"*.8"];
    [titleLabel alignCenterXWithView:self.view predicate:@"0"];
    _messageTitleLabel = titleLabel;

    UILabel *bodyTextLabel = [ARThemedFactory labelForBodyText];
    bodyTextLabel.textAlignment = NSTextAlignmentCenter;
    bodyTextLabel.textColor = [UIColor whiteColor];
    bodyTextLabel.backgroundColor = [UIColor clearColor];
    bodyTextLabel.numberOfLines = 0;
    [self.view addSubview:bodyTextLabel];
    [bodyTextLabel constrainTopSpaceToView:titleLabel predicate:@"8"];
    [bodyTextLabel alignCenterXWithView:self.view predicate:@"0"];
    _messageBodyLabel = bodyTextLabel;

    ARWhiteFlatButton *failureTryAgainButton = [[ARWhiteFlatButton alloc] initWithFrame:CGRectZero];
    [failureTryAgainButton constrainHeight:@"50"];
    [failureTryAgainButton setTitle:@"Send Again" forState:UIControlStateNormal];
    [self.view addSubview:failureTryAgainButton];
    [failureTryAgainButton constrainTopSpaceToView:self.messageBodyLabel predicate:@"20"];
    [failureTryAgainButton alignCenterXWithView:self.view predicate:@"0"];
    [failureTryAgainButton addTarget:self action:@selector(sendButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    _failureTryAgainButton = failureTryAgainButton;

    ARClearFlatButton *failureDismissButton = [[ARClearFlatButton alloc] initWithFrame:CGRectZero];
    [failureDismissButton constrainHeight:@"50"];
    [failureDismissButton setTitle:@"Cancel" forState:UIControlStateNormal];
    [self.view addSubview:failureDismissButton];
    [failureDismissButton constrainTopSpaceToView:self.failureTryAgainButton predicate:@"10"];
    [failureDismissButton alignCenterXWithView:self.view predicate:@"0"];
    [failureDismissButton addTarget:self action:@selector(cancelButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    _failureDismissButton = failureDismissButton;

    [self hideMessage];
    [self hideFailureButtons];
}

- (void)setStatusWithTitle:(NSString *)title body:(NSString *)body
{
    self.messageTitleLabel.text = title.uppercaseString;
    self.messageBodyLabel.text = body;

    [self.view setNeedsLayout];
    [self.view layoutIfNeeded];
}

- (void)fadeBackgroundVisible:(BOOL)makeVisible
{
    float fromValue = makeVisible ? 0.0 : 0.5;
    float toValue = makeVisible ? 0.5 : 0.0;
    if (ARPerformWorkAsynchronously) {
        CABasicAnimation *fade = [CABasicAnimation animationWithKeyPath:@"opacity"];
        fade.duration = ARAnimationDuration;
        fade.fromValue = [NSNumber numberWithFloat:fromValue];
        fade.toValue = [NSNumber numberWithFloat:toValue];
        fade.fillMode = kCAFillModeBoth;
        [self.backgroundView.layer addAnimation:fade forKey:@"backgroundOpacity"];
    }
    self.backgroundView.layer.opacity = toValue;
}

- (void)createBackground
{
    UIView *topContainer = [[UIView alloc] init];
    [self.view addSubview:topContainer];
    [topContainer alignLeading:@"0" trailing:@"0" toView:self.view];
    topContainer.backgroundColor = [UIColor clearColor];
    _inquiryHeightConstraint = [topContainer constrainHeightToView:self.view predicate:@"0"];

    // We will toggle the priority of the second constraint to determine whether or not it should take
    // precedence over the first in order to show/hide the form.
    [topContainer constrainTopSpaceToView:self.flk_topLayoutGuide predicate:@"0@500"];
    _hideInquiryConstraint = [topContainer constrainTopSpaceToView:self.flk_bottomLayoutGuide predicate:@"0@999"];

    _topContainer = topContainer;
    UIView *inquiryFormView = [[UIView alloc] init];
    [topContainer addSubview:inquiryFormView];

    inquiryFormView.clipsToBounds = YES;


    UIView *viewBehindKeyboard = [[UIView alloc] initWithFrame:CGRectZero];
    viewBehindKeyboard.backgroundColor = [UIColor blackColor];
    [self.view addSubview:viewBehindKeyboard];
    [viewBehindKeyboard alignLeading:@"0" trailing:@"0" toView:self.view];
    _keyboardPositionConstraint = [viewBehindKeyboard constrainTopSpaceToView:self.flk_bottomLayoutGuide predicate:@"0"];

    if ([UIDevice isPad]) {
        [inquiryFormView constrainWidth:@"600"];
        [inquiryFormView constrainHeight:@"<=600"];
        [inquiryFormView alignTopEdgeWithView:topContainer predicate:@"50"];
        [inquiryFormView alignBottomEdgeWithView:topContainer predicate:@"0@750"];
        [inquiryFormView alignCenterXWithView:topContainer predicate:@"0"];
    } else {
        [inquiryFormView alignToView:topContainer];
    }
    _inquiryFormView = inquiryFormView;
    _viewBehindKeyboard = viewBehindKeyboard;
}

- (void)keyboardWillShow:(NSNotification *)notification
{
    CGSize keyboardSize = [[[notification userInfo] objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
    CGFloat duration = [[[notification userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];

    CGFloat height = keyboardSize.height;

    self.inquiryHeightConstraint.constant = -height - self.topLayoutGuide.length;

    if (!self.keyboardHeightConstraint) {
        _keyboardHeightConstraint = [self.viewBehindKeyboard constrainHeight:@(height).stringValue];
    } else {
        self.keyboardHeightConstraint.constant = height;
    }
    [self.view layoutIfNeeded];

    // Show Keyboard
    self.keyboardPositionConstraint.constant = -height;
    [UIView animateIf:ARPerformWorkAsynchronously duration:duration:^{
        [self.view layoutIfNeeded];
    }];
}

- (void)keyboardWillHide:(NSNotification *)notification
{
    self.keyboardPositionConstraint.constant = 0;

    CGFloat duration = [[[notification userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];

    [UIView animateIf:ARPerformWorkAsynchronously duration:duration:^{
        [self.view layoutIfNeeded];
    }];
}

- (void)createTopMenu
{
    UIView *topMenuView = [[UIView alloc] init];
    [self.inquiryFormView addSubview:topMenuView];
    [topMenuView alignTopEdgeWithView:self.inquiryFormView predicate:@"0"];
    [topMenuView alignLeading:@"20" trailing:@"-20" toView:self.inquiryFormView];
    [topMenuView constrainHeight:@"60"];

    ARModalMenuButton *cancelButton = [[ARModalMenuButton alloc] init];
    [cancelButton ar_extendHitTestSizeByWidth:10 andHeight:10];
    cancelButton.titleLabel.textAlignment = NSTextAlignmentLeft;
    [cancelButton setTitle:@"Cancel" forState:UIControlStateNormal];
    [cancelButton setTitleColor:[UIColor artsyGraySemibold] forState:UIControlStateNormal];
    [cancelButton addTarget:self action:@selector(cancelButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    _cancelButton = cancelButton;
    [topMenuView addSubview:cancelButton];
    [cancelButton alignLeadingEdgeWithView:topMenuView predicate:@"0"];

    UILabel *titleLabel = [[UILabel alloc] init];
    titleLabel.font = [UIFont sansSerifFontWithSize:12];
    titleLabel.textAlignment = NSTextAlignmentCenter;
    if (self.state == ARInquireStatePartner) {
        if (self.artwork.partner.type == ARPartnerTypeGallery) {
            titleLabel.text = NSLocalizedString(@"CONTACT GALLERY", @"CONTACT GALLERY");
        } else {
            titleLabel.text = NSLocalizedString(@"CONTACT SELLER", @"CONTACT SELLER");
        }
    } else if (self.state == ARInquireStateRepresentative) {
        titleLabel.text = NSLocalizedString(@"CONTACT SPECIALIST", @"CONTACT SPECIALIST");
    }
    [topMenuView addSubview:titleLabel];
    [titleLabel alignCenterXWithView:topMenuView predicate:@"0"];

    ARModalMenuButton *sendButton = [[ARModalMenuButton alloc] init];
    [sendButton ar_extendHitTestSizeByWidth:10 andHeight:10];
    sendButton.titleLabel.textAlignment = NSTextAlignmentRight;
    [sendButton setTitle:@"Send" forState:UIControlStateNormal];
    [sendButton setTitleColor:[UIColor artsyPurpleRegular] forState:UIControlStateNormal];
    [sendButton setTitleColor:[[UIColor artsyPurpleRegular] colorWithAlphaComponent:0.3f] forState:UIControlStateHighlighted];
    [sendButton setTitleColor:[[UIColor artsyPurpleRegular] colorWithAlphaComponent:0.3f] forState:UIControlStateDisabled];
    [sendButton addTarget:self action:@selector(sendButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    _sendButton = sendButton;
    [topMenuView addSubview:sendButton];
    [sendButton alignTrailingEdgeWithView:topMenuView predicate:@"0"];

    ARSeparatorView *separator = [[ARSeparatorView alloc] init];
    [topMenuView addSubview:separator];
    [separator alignLeading:@"0" trailing:@"0" toView:topMenuView];
    [separator alignBottomEdgeWithView:topMenuView predicate:@"0"];

    [titleLabel alignTop:@"15" bottom:@"-15" toView:topMenuView];
    [UIView alignTopAndBottomEdgesOfViews:@[ cancelButton, titleLabel, sendButton ]];

    _topMenuView = topMenuView;
}

- (void)createNameEmailForm
{
    UIView *nameEmailForm = [[UIView alloc] init];
    [self.inquiryFormView addSubview:nameEmailForm];
    [nameEmailForm constrainTopSpaceToView:self.topMenuView predicate:@"0"];
    [nameEmailForm alignLeading:@"20" trailing:@"-20" toView:self.inquiryFormView];
    _nameEmailForm = nameEmailForm;

    UITextField *nameInput = [[UITextField alloc] init];
    nameInput.text = [ARUserManager sharedManager].currentUser.name;
    nameInput.textColor = [UIColor blackColor];
    nameInput.tintColor = [self inputTintColor];
    nameInput.attributedPlaceholder = [[NSAttributedString alloc] initWithString:@"Your Full Name" attributes:@{
        NSForegroundColorAttributeName : [UIColor artsyGraySemibold]
    }];
    nameInput.font = [UIFont serifFontWithSize:15];
    nameInput.clearButtonMode = UITextFieldViewModeNever;
    nameInput.keyboardType = UIKeyboardTypeNamePhonePad;
    nameInput.autocorrectionType = UITextAutocorrectionTypeNo;
    nameInput.autocapitalizationType = UITextAutocapitalizationTypeNone;
    nameInput.returnKeyType = UIReturnKeyNext;
    nameInput.keyboardAppearance = UIKeyboardAppearanceDark;
    nameInput.delegate = self;
    [nameEmailForm addSubview:nameInput];
    [nameInput addTarget:self action:@selector(nameInputHasChanged:) forControlEvents:UIControlEventEditingChanged];
    [nameInput alignTopEdgeWithView:nameEmailForm predicate:@"10"];
    [nameInput alignLeading:@"5" trailing:@"-5" toView:nameEmailForm];
    _nameInput = nameInput;

    ARDottedSeparatorView *nameInputSeparator = [[ARDottedSeparatorView alloc] init];
    [nameEmailForm addSubview:nameInputSeparator];
    [nameInputSeparator alignLeading:@"0" trailing:@"0" toView:nameEmailForm];
    [nameInputSeparator constrainTopSpaceToView:nameInput predicate:@"10"];


    UITextField *emailInput = [[UITextField alloc] init];
    emailInput.text = [ARUserManager sharedManager].currentUser.email;
    [self setUpEmailValidator];
    // Initial validation of existing trialUseEmail to set initial SEND button state.
    [self.emailValidator validate:emailInput.text];

    emailInput.textColor = [UIColor blackColor];
    emailInput.tintColor = [self inputTintColor];
    emailInput.attributedPlaceholder = [[NSAttributedString alloc] initWithString:@"Your Email" attributes:@{
        NSForegroundColorAttributeName : [UIColor artsyGraySemibold]
    }];
    emailInput.font = [UIFont serifFontWithSize:15];
    emailInput.clearButtonMode = UITextFieldViewModeNever;
    emailInput.keyboardType = UIKeyboardTypeEmailAddress;
    emailInput.autocorrectionType = UITextAutocorrectionTypeNo;
    emailInput.autocapitalizationType = UITextAutocapitalizationTypeNone;
    emailInput.returnKeyType = UIReturnKeyNext;
    emailInput.keyboardAppearance = UIKeyboardAppearanceDark;
    emailInput.delegate = self;
    [emailInput addTarget:self action:@selector(emailInputHasChanged:) forControlEvents:UIControlEventEditingChanged];
    [nameEmailForm addSubview:emailInput];
    [emailInput constrainTopSpaceToView:nameInputSeparator predicate:@"10"];
    [emailInput alignLeading:@"5" trailing:@"-5" toView:nameEmailForm];
    _emailInput = emailInput;

    ARDottedSeparatorView *emailInputSeparator = [[ARDottedSeparatorView alloc] init];
    [nameEmailForm addSubview:emailInputSeparator];
    [emailInputSeparator alignLeading:@"0" trailing:@"0" toView:nameEmailForm];
    [emailInputSeparator constrainTopSpaceToView:emailInput predicate:@"10"];

    [nameEmailForm alignBottomEdgeWithView:emailInputSeparator predicate:@"0"];
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    if (textField == self.nameInput) {
        [self.emailInput becomeFirstResponder];
    } else if (textField == self.emailInput) {
        [self.textView becomeFirstResponder];
    }
    return YES;
}

- (void)createArtworkSection
{
    UIView *artworkView = [[UIView alloc] init];
    [self.inquiryFormView addSubview:artworkView];
    _artworkView = artworkView;
    [artworkView constrainHeight:@"30"];
    [artworkView constrainTopSpaceToView:self.contentSeparator predicate:@"10"];
    [artworkView alignLeading:@"20" trailing:@"-20" toView:self.inquiryFormView];

    UIImageView *artworkPreview = [[UIImageView alloc] init];
    [artworkView addSubview:artworkPreview];
    [artworkPreview constrainWidth:@"30" height:@"30"];
    artworkPreview.contentMode = UIViewContentModeScaleAspectFit;
    [artworkPreview ar_setImageWithURL:self.artwork.defaultImage.urlForSquareImage];
    [artworkPreview alignLeadingEdgeWithView:artworkView predicate:@"0"];
    [artworkPreview alignTopEdgeWithView:artworkView predicate:@"0"];

    UIView *artworkInfoView = [[UIView alloc] init];
    [artworkView addSubview:artworkInfoView];
    [artworkInfoView constrainLeadingSpaceToView:artworkPreview predicate:@"10"];
    [artworkInfoView alignTrailingEdgeWithView:artworkView predicate:@"0"];
    [artworkInfoView alignTop:@"2" bottom:@"0" toView:artworkView];

    if (self.state == ARInquireStatePartner) {
        UILabel *partnerNameLabel = [[UILabel alloc] init];
        partnerNameLabel.font = [UIFont sansSerifFontWithSize:10];
        partnerNameLabel.text = self.artwork.partner.name.uppercaseString;
        partnerNameLabel.lineBreakMode = NSLineBreakByTruncatingTail;
        [artworkInfoView addSubview:partnerNameLabel];
        [partnerNameLabel alignTopEdgeWithView:artworkInfoView predicate:@"0"];
        [partnerNameLabel alignLeading:@"0" trailing:@"0" toView:artworkInfoView];

        NSMutableAttributedString *artworkString = [[NSMutableAttributedString alloc] initWithString:NSStringWithFormat(@"%@", self.artwork.artist.name) attributes:@{NSFontAttributeName : [UIFont serifFontWithSize:13]}];
        if (self.artwork.title.length > 0) {
            [artworkString appendAttributedString:[[NSMutableAttributedString alloc] initWithString:@", " attributes:@{NSFontAttributeName : [UIFont serifFontWithSize:13]}]];
            [artworkString appendAttributedString:[[NSMutableAttributedString alloc] initWithString:self.artwork.title attributes:@{NSFontAttributeName : [UIFont serifItalicFontWithSize:13]}]];
        }

        UILabel *artworkLabel = [[UILabel alloc] init];
        artworkLabel.attributedText = artworkString.copy;
        artworkLabel.textColor = [UIColor artsyGraySemibold];
        artworkLabel.lineBreakMode = NSLineBreakByTruncatingTail;
        [artworkInfoView addSubview:artworkLabel];

        [artworkLabel alignLeading:@"0" trailing:@"0" toView:artworkInfoView];
        [artworkLabel constrainTopSpaceToView:partnerNameLabel predicate:@"0"];
        [artworkLabel alignBottomEdgeWithView:artworkInfoView predicate:@"0"];

    } else {
        UILabel *artworkArtist = [[UILabel alloc] init];
        artworkArtist.font = [UIFont serifFontWithSize:13];
        artworkArtist.text = self.artwork.artist.name;
        artworkArtist.textColor = [UIColor artsyGraySemibold];
        artworkArtist.lineBreakMode = NSLineBreakByTruncatingTail;
        [artworkInfoView addSubview:artworkArtist];
        [artworkArtist alignLeading:@"0" trailing:@"0" toView:artworkInfoView];
        [artworkArtist alignTopEdgeWithView:artworkInfoView predicate:@"0"];

        UILabel *artworkTitle = [[UILabel alloc] init];
        artworkTitle.font = [UIFont serifItalicFontWithSize:13];
        artworkTitle.text = self.artwork.title;
        artworkTitle.textColor = [UIColor artsyGraySemibold];
        artworkTitle.lineBreakMode = NSLineBreakByTruncatingTail;
        [artworkInfoView addSubview:artworkTitle];

        [artworkTitle alignLeading:@"0" trailing:@"0" toView:artworkInfoView];
        [artworkTitle constrainTopSpaceToView:artworkArtist predicate:@"0"];
        [artworkTitle alignBottomEdgeWithView:artworkInfoView predicate:@"0"];
    }
}

- (void)createUserSignature
{
    User *currentUser = self.user;
    if (currentUser) {
        UILabel *userSignature = [[UILabel alloc] init];
        userSignature.font = self.textView.font;
        userSignature.textColor = [UIColor artsyGraySemibold];
        userSignature.text = currentUser.name ?: currentUser.email;

        // We dont have access to whether the user is an admin in a User
        // but, given our policy of only having artsy emails
        // for admins, we can rely on that as an indicator.

        if ([currentUser.email containsString:@"@artsymail"] || [currentUser.email containsString:@"@artsy.net"]) {
            userSignature.textColor = [UIColor artsyRedRegular];
            userSignature.text = @"Note: This will fail, admins cannot inquire.";
        }

        [self.inquiryFormView addSubview:userSignature];

        [userSignature constrainTopSpaceToView:self.contentView predicate:@"10"];
        [userSignature alignLeadingEdgeWithView:self.contentView predicate:@"5"];
        _userSignature = userSignature;
    }
}

- (void)createContentSeparator
{
    ARSeparatorView *separator = [[ARSeparatorView alloc] init];
    [self.inquiryFormView addSubview:separator];
    [separator alignLeading:@"0" trailing:@"0" toView:self.contentView];
    [separator constrainTopSpaceToView:self.userSignature ?: self.contentView predicate:@"5"];
    _contentSeparator = separator;
}

- (void)createArtsySpecialistSection
{
    UIView *specialistView = [[UIView alloc] init];
    [self.inquiryFormView addSubview:specialistView];
    _specialistView = specialistView;
    [specialistView constrainHeight:@"35"];
    // either at the bottom of the content view or user signature or under the top menu view, depending on which order it has been created with
    [specialistView constrainTopSpaceToView:self.contentSeparator ?: self.nameEmailForm ?: self.topMenuView predicate:@"10"];
    [specialistView alignLeading:@"20" trailing:@"-20" toView:self.inquiryFormView];

    UIImageView *specialistHeadImage = [[UIImageView alloc] init];
    [specialistView addSubview:specialistHeadImage];
    [specialistHeadImage constrainWidth:@"35" height:@"35"];
    specialistHeadImage.contentMode = UIViewContentModeScaleAspectFit;
    [specialistHeadImage alignCenterYWithView:specialistView predicate:@"0"];
    [specialistHeadImage alignLeadingEdgeWithView:specialistView predicate:@"0"];
    _specialistHeadImage = specialistHeadImage;

    UIView *specialistInfoView = [[UIView alloc] init];
    [specialistView addSubview:specialistInfoView];
    [specialistInfoView alignAttribute:NSLayoutAttributeLeading toAttribute:NSLayoutAttributeTrailing ofView:specialistHeadImage predicate:@"10"];
    [specialistInfoView alignCenterYWithView:specialistView predicate:@"0"];
    [specialistInfoView alignTrailingEdgeWithView:specialistView predicate:@"0"];

    UILabel *specialistLabel = [[UILabel alloc] init];
    specialistLabel.font = [UIFont sansSerifFontWithSize:10];
    specialistLabel.text = @"ARTSY SPECIALIST";
    [specialistView addSubview:specialistLabel];
    [specialistLabel alignTopEdgeWithView:specialistInfoView predicate:@"0"];
    [specialistLabel alignLeading:@"0" trailing:@"0" toView:specialistInfoView];

    UILabel *specialistNameLabel = [[UILabel alloc] init];
    specialistNameLabel.font = [UIFont serifFontWithSize:12];
    specialistNameLabel.text = self.artwork.displayTitle;
    specialistNameLabel.textColor = [UIColor artsyGraySemibold];
    specialistNameLabel.numberOfLines = 0;
    specialistNameLabel.lineBreakMode = NSLineBreakByTruncatingTail;
    [specialistInfoView addSubview:specialistNameLabel];
    [specialistNameLabel alignAttribute:NSLayoutAttributeTop toAttribute:NSLayoutAttributeBottom ofView:specialistLabel predicate:@"5"];
    [specialistNameLabel alignLeading:@"0" trailing:@"0" toView:specialistInfoView];
    _specialistNameLabel = specialistNameLabel;

    [specialistInfoView alignBottomEdgeWithView:specialistNameLabel predicate:@"0"];
}

- (void)createContentScrollView
{
    UIScrollView *contentView = [[UIScrollView alloc] init];
    [self.inquiryFormView addSubview:contentView];
    [contentView constrainTopSpaceToView:self.specialistView ?: self.nameEmailForm ?: self.topMenuView predicate:@"10"];
    [contentView alignLeading:@"20" trailing:@"-20" toView:self.inquiryFormView];
    _contentView = contentView;
}

- (void)createTextInputArea
{
    UITextView *textView = [[UITextView alloc] init];
    textView.editable = YES;
    textView.delegate = self;
    textView.clipsToBounds = NO;
    textView.textContainerInset = UIEdgeInsetsMake(0, -4, 0, -4);
    textView.attributedText = [self attributedStringForTextView];
    textView.keyboardAppearance = UIKeyboardAppearanceDark;
    // TODO: if there's a specialist on duty, display their name with Hello [Name]
    // TODO: if the artwork has pricing, don't say "confirm the price"

    textView.textColor = [UIColor blackColor];
    textView.tintColor = [self inputTintColor];
    [self.contentView addSubview:textView];
    _textView = textView;
    [textView alignLeadingEdgeWithView:self.contentView predicate:@"0"];
    [textView alignTopEdgeWithView:self.contentView predicate:@"0"];
    [textView constrainWidthToView:self.contentView predicate:@"0"];
    [textView constrainHeightToView:self.contentView predicate:@"0"];
    textView.autocorrectionType = UITextAutocorrectionTypeNo;
}

- (NSAttributedString *)attributedStringForTextView
{
    NSString *message = [NSString stringWithFormat:@"Hello, I'm interested in this work by %@. Please confirm the price and availability of this work.", self.artwork.artist.name];
    NSMutableAttributedString *attributedMessage = [[NSMutableAttributedString alloc] initWithString:message];

    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineHeightMultiple:1.2];
    [attributedMessage addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, [message length])];

    [attributedMessage addAttribute:NSFontAttributeName value:[UIFont serifFontWithSize:16]
                              range:NSMakeRange(0, [message length])];

    return attributedMessage.copy;
}


- (void)showInquiryForm
{
    self.hideInquiryConstraint.priority = 1;
    self.inquiryFormView.userInteractionEnabled = YES;
    self.textView.editable = YES;
    [UIView animateIf:ARPerformWorkAsynchronously duration:ARAnimationDuration:^{
        [self.view layoutIfNeeded];
    }];
}

- (void)hideInquiryForm
{
    self.hideInquiryConstraint.priority = 999;
    self.inquiryFormView.userInteractionEnabled = NO;
    self.textView.editable = NO;
    [UIView animateIf:ARPerformWorkAsynchronously duration:ARAnimationDuration:^{
        [self.view layoutIfNeeded];
    }];
}

- (void)viewWillAppear:(BOOL)animated
{
    // Seems to be an iOS bug where the text doesn't appear in the text view
    // during viewDidLoad - this retriggers rendering and shows the text. ./
    self.textView.textColor = self.textView.textColor;
    self.inquiryFormView.backgroundColor = [UIColor whiteColor];

    // register for keyboard notifications
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillShow:)
                                                 name:UIKeyboardWillShowNotification
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillHide:)
                                                 name:UIKeyboardWillHideNotification
                                               object:nil];

    [super viewWillAppear:animated];
}

- (void)viewDidAppear:(BOOL)animated
{
    self.inquiryHeightConstraint.constant = -self.topLayoutGuide.length;
    if (self.nameInput && !(self.nameInput.text.length > 0)) {
        [self.nameInput becomeFirstResponder];
    } else {
        [self.textView becomeFirstResponder];
    }
    [self fadeBackgroundVisible:YES];
    [self showInquiryForm];
    [super viewDidAppear:animated];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardWillShowNotification object:nil];
}

- (void)getCurrentAdmin
{
    __weak typeof(self) wself = self;
    [ArtsyAPI getInquiryContact:^(User *contactStub) {
        __strong typeof (wself) sself = wself;
        sself.specialistNameLabel.text = contactStub.name;

    } withProfile:^(Profile *contactProfile) {
        __strong typeof (wself) sself = wself;
        // Use a white BG because the square to circle looks ugly
        [sself.specialistHeadImage ar_setImageWithURL:[NSURL URLWithString:contactProfile.iconURL] placeholderImage:[UIImage imageFromColor:[UIColor whiteColor]]];

    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        ARErrorLog(@"Couldn't get an inquiry contact. %@", error.localizedDescription);
        [sself performSelector:@selector(getCurrentAdmin) withObject:nil afterDelay:2];
    }];
}

- (void)cancelButtonTapped:(UIButton *)sender
{
    [self.inquiryFormView endEditing:YES];
    [self hideInquiryForm];
    [self removeFromHostViewController];
}

- (void)sendButtonTapped:(UIButton *)sender
{
    [self.inquiryFormView endEditing:YES];
    [self hideInquiryForm];
    self.cancelButton.enabled = NO;
    self.sendButton.enabled = NO;
    [self hideFailureButtons];
    [self setStatusWithTitle:@"Sending…" body:@""];
    [self sendInquiry];
    [self presentMessage];
    [self.view endEditing:YES];
}

- (void)sendInquiry
{
    void (^success)(id message) = ^(id message) {
        [self inquiryCompleted:message];
    };

    void (^failure)(NSError *error) = ^(NSError *error) {
        [self inquiryFailed:error];
    };

    ARAppDelegate *delegate = [ARAppDelegate sharedInstance];

    NSDictionary *analyticsDictionary = @{
        ArtsyAPIInquiryAnalyticsInquiryURL : self.inquiryURLRepresentation ?: @"",
        ArtsyAPIInquiryAnalyticsReferralURL : delegate.referralURLRepresentation ?: @"",
        ArtsyAPIInquiryAnalyticsLandingURL : delegate.landingURLRepresentation ?: @"",
    };

    if (self.state == ARInquireStateRepresentative) {
        [ArtsyAPI createRepresentativeArtworkInquiryForArtwork:self.artwork
                                                          name:self.nameInput.text
                                                         email:self.emailInput.text
                                                       message:self.textView.text
                                           analyticsDictionary:analyticsDictionary
                                                       success:success
                                                       failure:failure];
    } else {
        [ArtsyAPI createPartnerArtworkInquiryForArtwork:self.artwork
                                                   name:self.nameInput.text
                                                  email:self.emailInput.text
                                                message:self.textView.text
                                    analyticsDictionary:analyticsDictionary
                                                success:success
                                                failure:failure];
    }
}

- (UIColor *)inputTintColor
{
    return ARPerformWorkAsynchronously ? [UIColor artsyPurpleRegular] : [UIColor whiteColor];
}

- (void)inquiryCompleted:(NSString *)message
{
    ADJEvent *event = [ADJEvent eventWithEventToken:ARAdjustSentArtworkInquiry];
    [event addCallbackParameter:@"artwork" value:self.artwork.name];
    [event addCallbackParameter:@"email" value:self.emailInput.text];
    [Adjust trackEvent:event];

    [self setStatusWithTitle:@"Thank you" body:@"Your message has been sent"];
    [self performSelector:@selector(removeFromHostViewController) withObject:nil afterDelay:2];
}

- (void)inquiryFailed:(NSError *)error
{
    ARErrorLog(@"Error sending inquiry for artwork %@. Error: %@", self.artwork.artworkID, error.localizedDescription);
    NSString *errorTitle, *errorMessage;
    // think we need to return JSON in this error to not do this
    errorTitle = @"Error Sending Message";
    errorMessage = @"Please try again or email\nsupport@artsy.net if the issue persists";

    [self setStatusWithTitle:errorTitle body:errorMessage];
    [self presentFailureButtons];
}

- (void)hideMessage
{
    self.messageTitleLabel.hidden = YES;
    self.messageBodyLabel.hidden = YES;
}

- (void)presentMessage
{
    self.messageTitleLabel.hidden = NO;
    self.messageBodyLabel.hidden = NO;
}

- (void)hideFailureButtons
{
    self.failureTryAgainButton.hidden = YES;
    self.failureDismissButton.hidden = YES;
}

- (void)presentFailureButtons
{
    self.failureTryAgainButton.hidden = NO;
    self.failureDismissButton.hidden = NO;
}

- (void)setUpEmailValidator
{
    _emailValidator = [ALPValidator validatorWithType:ALPValidatorTypeString];
    [self.emailValidator addValidationToEnsureValidEmailWithInvalidMessage:NSLocalizedString(@"Please enter a valid email", nil)];

    __weak typeof(self) wself = self;
    self.emailValidator.validatorStateChangedHandler = ^(ALPValidatorState newState) {
        __strong typeof (wself) sself = wself;
        sself.sendButton.enabled = sself.emailValidator.isValid;
      // We can also use newState to determine what to do in more complex situations. Validator states include:
      // ALPValidatorValidationStateValid, ALPValidatorValidationStateInvalid, ALPValidatorValidationStateWaitingForRemote
    };
}

- (NSString *)body
{
    return self.textView.text;
}

#pragma mark - DI

- (User *)user
{
    return _user ?: [User currentUser];
}

@end
