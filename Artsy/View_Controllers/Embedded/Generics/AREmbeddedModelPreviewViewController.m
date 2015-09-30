#import "AREmbeddedModelPreviewViewController.h"

@interface AREmbeddedModelPreviewViewController ()

@end

@implementation AREmbeddedModelPreviewViewController


- (void)viewDidLoad
{
    [super viewDidLoad];

    self.view.backgroundColor = [UIColor artsyRed];
}


- (NSArray<id<UIPreviewActionItem>> *)previewActionItems
{
    UIPreviewAction *action = [UIPreviewAction actionWithTitle:@"HI" style:UIPreviewActionStyleDefault handler:^(UIPreviewAction * _Nonnull action, UIViewController * _Nonnull previewViewController) {
        NSLog(@"@OK");
    }];

    return @[action];

}

@end
