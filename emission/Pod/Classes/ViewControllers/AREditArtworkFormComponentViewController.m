#import "AREditArtworkFormComponentViewController.h"
#import "AREmission.h"

@implementation AREditArtworkFormComponentViewController

- (instancetype)initWithArtworkID:(NSString *)artworkID
{
    return [self initWithArtworkID:artworkID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithArtworkID:(NSString *)artworkID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"EditArtworkForm" initialProperties:@{ @"artworkID": artworkID }];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
}

@end
