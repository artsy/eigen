typedef NS_ENUM(NSInteger, ARTrialContext){
    ARTrialContextNotTrial,
    ARTrialContextFavoriteArtwork,
    ARTrialContextFavoriteArtist,
    ARTrialContextFavoriteGene,
    ARTrialContextShowingFavorites,
    ARTrialContextContactGallery,
    ARTrialContextRepresentativeInquiry,
    ARTrialContextPeriodical,
    ARTrialContextAuctionBid,
    ARTrialContextFavoriteProfile,
    ARTrialContextArtworkOrder,
    ARTrialContextFairGuide
};

@interface ARTrialController : NSObject

/// Shows the sign up, with optional completion block to be triggered after signup or login.
+ (void)presentTrialWithContext:(enum ARTrialContext)context success:(void (^)(BOOL newUser))success;

/// Get the guest authentication token and run the completion block
+ (void)startTrialWithCompletion:(void (^)(void))completion failure:(void (^)(NSError *error))failure;

/// No-op if you didn't have a trial account before signing up
/// otherwise will run the "favorite" artwork or whatever started the splash

+ (void)performCompletionNewUser:(BOOL)newUser;

/// Adds one to the number of view controllers shown before showing the splash
+ (void)shownAViewController;

/// When the app returns from being backgrounded we should increment said number above
/// to avoid seeing the splash after your first tap
+ (void)extendTrial;

+ (NSString *)stringForTrialContext:(enum ARTrialContext)context;

+ (ARTrialController *)instance;

@property (readonly, nonatomic, assign) NSInteger threshold;

@end
