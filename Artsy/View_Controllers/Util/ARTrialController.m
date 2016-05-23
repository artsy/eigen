#import "ARUserManager.h"
#import "ARAppConstants.h"
#import "ARAppDelegate.h"
#import "ARDefaults.h"
#import <UIAlertView_Blocks/UIAlertView+Blocks.h>

static ARTrialController *instance;


@interface ARTrialController ()
@property (readwrite, nonatomic, assign) NSInteger threshold;
@property (readwrite, nonatomic, assign) NSInteger count;
@property (nonatomic, copy) void (^successCallback)(BOOL newUser);
@end


@implementation ARTrialController

+ (ARTrialController *)instance
{
    return instance;
}

+ (void)initialize
{
    if ([self class] == [ARTrialController class]) {
        instance = [[ARTrialController alloc] init];
    }
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self reset];
    }
    return self;
}

- (void)reset
{
    self.count = 0;
    self.threshold = [[NSUserDefaults standardUserDefaults] integerForKey:AROnboardingPromptThresholdDefault];
    if (self.threshold <= 0) {
        self.threshold = 25; //just in case
    }
}

+ (void)presentTrialIfNecessaryWithContext:(enum ARTrialContext)context onLoggedInUser:(void (^)(BOOL newUser))completion
{
    if ([User isTrialUser]) {
        [instance presentTrialWithContext:context success:completion];
    } else {
        completion(NO);
    }
}

+ (void)presentTrialWithContext:(enum ARTrialContext)context success:(void (^)(BOOL newUser))success
{
    [instance presentTrialWithContext:context success:success];
}


- (void)presentTrialWithContext:(enum ARTrialContext)context success:(void (^)(BOOL newUser))success
{
    if (ARIsRunningInDemoMode) {
        [UIAlertView showWithTitle:nil message:@"Feature not enabled for this demo" cancelButtonTitle:@"OK" otherButtonTitles:nil tapBlock:nil];
        return;
    }

    if ([User isTrialUser]) {
        self.successCallback = success;

        ARAppDelegate *appDelegate = [ARAppDelegate sharedInstance];
        [appDelegate showOnboardingWithState:ARInitialOnboardingStateInApp];
    }
}


+ (NSString *)stringForTrialContext:(enum ARTrialContext)context
{
    switch (context) {
        case ARTrialContextFavoriteArtist:
            return @"favoriting_artist";
        case ARTrialContextFavoriteGene:
            return @"favoriting_gene";
        case ARTrialContextFavoriteArtwork:
            return @"favoriting_artwork";
        case ARTrialContextShowingFavorites:
            return @"showing_favorites";
        case ARTrialContextPeriodical:
            return @"periodical";
        case ARTrialContextRepresentativeInquiry:
            return @"contact_rep";
        case ARTrialContextContactGallery:
            return @"contact_gallery";
        case ARTrialContextNotTrial:
            return @"";
        case ARTrialContextAuctionBid:
            return @"auction_bid";
        case ARTrialContextAuctionRegistration:
            return @"auction_registration";
        case ARTrialContextFavoriteProfile:
            return @"favoriting_profile";
        case ARTrialContextArtworkOrder:
            return @"artwork_order";
        case ARTrialContextFairGuide:
            return @"fair_guide";
        case ARTrialContextNotifications:
            return @"works_for_you";
    }
}

+ (void)performCompletionNewUser:(BOOL)newUser
{
    if ([User currentUser]) {
        [instance performCompletionNewUser:newUser];
    }
}

- (void)performCompletionNewUser:(BOOL)newUser
{
    if (self.successCallback) {
        self.successCallback(newUser);
    }
}

+ (void)extendTrial
{
    [instance extendTrial];
}

- (void)extendTrial
{
    [self reset];
}

+ (void)shownAViewController
{
    [instance shownAViewController];
}

- (void)shownAViewController
{
    self.count++;

    BOOL shouldShowSplash = self.count >= self.threshold;
    if (shouldShowSplash) {
        [self presentTrialWithContext:ARTrialContextPeriodical success:nil];
        [self reset];
    }
}

@end
