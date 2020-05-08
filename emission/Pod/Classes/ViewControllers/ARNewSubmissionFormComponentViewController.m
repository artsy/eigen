#import "ARNewSubmissionFormComponentViewController.h"
#import "AREmission.h"

@implementation ARNewSubmissionFormComponentViewController

- (instancetype)initWithArtworkID:(NSString *)artworkID
{
    return [self initWithArtworkID:artworkID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithArtworkID:(NSString *)artworkID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"NewSubmissionForm" initialProperties:@{ @"artworkID": artworkID }];
}

- (instancetype)init
{
    return [super initWithEmission:nil moduleName:@"NewSubmissionForm" initialProperties:nil];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
}

@end
