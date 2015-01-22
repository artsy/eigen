#import "ARUserManager.h"
#import "ARAppDelegate.h"
#import <UIAlertView+Blocks/UIAlertView+Blocks.h>

static ARTrialController *instance;

@interface ARTrialController ()
@property (readwrite, nonatomic, assign) NSInteger threshold;
@property (readwrite, nonatomic, assign) NSInteger count;
@property (readwrite, nonatomic, assign) SEL selectorForPostSignup;
@property (readwrite, nonatomic, strong) id targetForPostSignup;
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

+ (void)presentTrialWithContext:(enum ARTrialContext)context fromTarget:(id)target selector:(SEL)selector
{
    [instance presentTrialWithContext:context fromTarget:target selector:selector];
}

- (void)presentTrialWithContext:(enum ARTrialContext)context fromTarget:(id)target selector:(SEL)selector
{
    if (ARIsRunningInDemoMode) {
        [UIAlertView showWithTitle:nil message:@"Feature not enabled for this demo" cancelButtonTitle:@"OK" otherButtonTitles:nil tapBlock:nil];
        return;
    }

    if ([User isTrialUser]) {
        self.selectorForPostSignup = selector;
        self.targetForPostSignup = target;

        ARAppDelegate *appDelegate = [ARAppDelegate sharedInstance];
        [appDelegate showTrialOnboardingWithState:ARInitialOnboardingStateInApp andContext:context];
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
        case ARTrialContextFavoriteProfile:
            return @"favoriting_profile";
        case ARTrialContextArtworkOrder:
            return @"artwork_order";
        case ARTrialContextFairGuide:
            return @"fair_guide";
    }
}

+ (void)performPostSignupEvent
{
    [instance performPostSignupEvent];
}

- (void)performPostSignupEvent
{
    if (self.selectorForPostSignup && self.targetForPostSignup) {
        if ([self.targetForPostSignup respondsToSelector:self.selectorForPostSignup]) {

# pragma clang diagnostic push
# pragma clang diagnostic ignored "-Warc-performSelector-leaks"
            [self.targetForPostSignup performSelector:self.selectorForPostSignup withObject:nil];
# pragma clang diagnostic pop

        }
    }
}


+ (void)startTrialWithCompletion:(void (^)(void))completion failure:(void (^)(NSError *error))failure
{
    [[ARUserManager sharedManager] startTrial:completion failure:failure];
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
        [self presentTrialWithContext:ARTrialContextPeriodical fromTarget:nil selector:nil];
        [self reset];
    }

}

@end
