#import "AREmbeddedModelsPreviewDelegate.h"
#import "AREmbeddedModelsViewController.h"
#import "AREmbeddedModelPreviewViewController.h"

@interface AREmbeddedModelsPreviewDelegate()
// Parent holds it
@property (nonatomic, weak, readonly) AREmbeddedModelsViewController *modelVC;
@end

@implementation AREmbeddedModelsPreviewDelegate

- (instancetype)initWithModelVC:(AREmbeddedModelsViewController *)modelVC;
{
    self = [super init];
    if (!self) {
        return nil;
    }
    _modelVC = modelVC;
       self.modelVC.collectionView.backgroundColor = [UIColor artsyAttention];
    return self;
}

- (nullable UIViewController *)previewingContext:(id <UIViewControllerPreviewing>)previewingContext viewControllerForLocation:(CGPoint)location
{
    self.modelVC.collectionView.backgroundColor = [UIColor artsyPurple];

    AREmbeddedModelsViewController *embed = [[AREmbeddedModelsViewController alloc] init];
    embed.preferredContentSize = CGSizeMake(400, 600);
    previewingContext.sourceRect = CGRectMake(25, 25, 200, 200);
    return embed;
}


- (void)previewingContext:(id <UIViewControllerPreviewing>)previewingContext commitViewController:(UIViewController *)viewControllerToCommit
{

}


@end
