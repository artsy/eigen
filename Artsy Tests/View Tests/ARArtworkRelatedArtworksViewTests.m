#import "ARArtworkRelatedArtworksView.h"
#import "AREmbeddedModelsViewController.h"
#import "ARArtworkMasonryModule.h"

@interface ARArtworkRelatedArtworksView (Testing)
@property (nonatomic, strong) AREmbeddedModelsViewController *artworksVC;
- (void)renderWithArtworks:(NSArray *)artworks heading:(NSString *)heading;
@end

SpecBegin(ARArtworkRelatedArtworksView)

__block ARArtworkRelatedArtworksView *relatedView;

before(^{
    relatedView = [[ARArtworkRelatedArtworksView alloc] init];
    [relatedView renderWithArtworks:@[[Artwork modelFromDictionary:@{@"title": @"Title"}]] heading:@"Related Heading"];
});

describe(@"iPhone", ^{
    it(@"initializes module with correct layout", ^{
        ARArtworkMasonryLayout layout = [(ARArtworkMasonryModule *)relatedView.artworksVC.activeModule layout];
        expect(layout).to.equal(ARArtworkMasonryLayout2Column);
    });
});

describe(@"iPad", ^{
    beforeAll(^{
        [ARTestContext stubDevice:ARDeviceTypePad];
    });

    afterAll(^{
        [ARTestContext stopStubbing];
    });

    it(@"initializes the module with correct layout", ^{
        ARArtworkMasonryLayout layout = [(ARArtworkMasonryModule *)relatedView.artworksVC.activeModule layout];
        expect(layout).to.equal(ARArtworkMasonryLayout3Column);
    });

    it(@"returns correct layout for orientation", ^{
        expect([relatedView masonryLayoutForPadWithOrientation:UIInterfaceOrientationLandscapeLeft]).to.equal(ARArtworkMasonryLayout4Column);
        expect([relatedView masonryLayoutForPadWithOrientation:UIInterfaceOrientationLandscapeRight]).to.equal(ARArtworkMasonryLayout4Column);
        expect([relatedView masonryLayoutForPadWithOrientation:UIInterfaceOrientationPortrait]).to.equal(ARArtworkMasonryLayout3Column);
        expect([relatedView masonryLayoutForPadWithOrientation:UIInterfaceOrientationPortraitUpsideDown]).to.equal(ARArtworkMasonryLayout3Column);
    });
});

SpecEnd
