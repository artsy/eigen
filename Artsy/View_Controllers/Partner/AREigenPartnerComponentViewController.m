#import "AREigenPartnerComponentViewController.h"
#import "UIViewController+SimpleChildren.h"

@interface AREigenPartnerComponentViewController()

@property (nonatomic, strong, readwrite) NSString *partnerID;

@end

@implementation AREigenPartnerComponentViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self embedEmissionVC];
}

- (instancetype)initWithPartnerID:(NSString *)partnerID
{
    self = [super init];
    if (!self) {
        return nil;
    }

    self.partnerID = partnerID;

    return self;
}

- (void)embedEmissionVC {
    // We need to call begin/endAppearanceTransition manually, because at this point, our view controller
    // has already appeared (so newly added children won't receive viewWill/DidAppear callbacks automatically).
    ARPartnerComponentViewController *emissionVC = [[ARPartnerComponentViewController alloc] initWithPartnerID: self.partnerID];
    [emissionVC beginAppearanceTransition:true animated:false];
    [self ar_addAlignedModernChildViewController:emissionVC];
    [emissionVC endAppearanceTransition];
}

@end
