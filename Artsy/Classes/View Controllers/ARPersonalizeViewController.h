#import "AROnboardingViewController.h"

@class AROnboardingGeneTableController;
@class AROnboardingArtistTableController;

@interface ARPersonalizeViewController : UIViewController

- (instancetype)initWithGenes:(NSArray *)genes;
@property (nonatomic, weak) id<AROnboardingStepsDelegate> delegate;

@property (nonatomic, assign, readonly) NSInteger followedThisSession;
@property (nonatomic, readonly) AROnboardingGeneTableController *geneController;
@property (nonatomic, readonly) AROnboardingArtistTableController *artistController;

@end
