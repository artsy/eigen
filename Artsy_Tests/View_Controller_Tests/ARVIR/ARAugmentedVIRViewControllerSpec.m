@import Forgeries;
@class ARSCNView, SCNScene;

#import "ARDefaults.h"
#import "ARAugmentedVIRViewController.h"

API_AVAILABLE(ios(11.0))
@interface ARAugmentedVIRViewController ()
@property (nonatomic, strong) ARSCNView *sceneView;
@end

@interface FakeARSession: NSObject
@property (weak) id delegate;
@end

@interface FakeSceneView: UIView
@property (strong) SCNScene *scene;
@property (weak) id delegate;
@property (strong) FakeARSession *session;
@end


@implementation FakeARSession
@end

@implementation FakeSceneView

- (instancetype)init
{
    self = [super init];
    self.backgroundColor = [UIColor grayColor];
    self.frame = [UIScreen mainScreen].bounds;
    return self;
}

@end

SpecBegin(ARAugmentedVIRViewController);
if (@available(iOS 11.3, *)) {

it(@"defaults to showing info",^{
    ARAugmentedVIRViewController *vc = [[ARAugmentedVIRViewController alloc] initWithConfig:nil];
    vc.sceneView = (id)[[FakeSceneView alloc] init];
    expect(vc).to.haveValidSnapshot();
});

it(@"shows the right info when a wall is registered",^{
    ARAugmentedVIRViewController *vc = [[ARAugmentedVIRViewController alloc] initWithConfig:nil];
    vc.sceneView = (id)[[FakeSceneView alloc] init];
    [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
    [vc hasRegisteredPlanes];

    expect(vc.view).to.haveValidSnapshot();
});

it(@"shows the right info when an artwork was placed",^{
    ARAugmentedVIRViewController *vc = [[ARAugmentedVIRViewController alloc] initWithConfig:nil];
    vc.sceneView = (id)[[FakeSceneView alloc] init];
    [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
    [vc hasPlacedArtwork];

    expect(vc.view).to.haveValidSnapshot();
});

}
SpecEnd;

