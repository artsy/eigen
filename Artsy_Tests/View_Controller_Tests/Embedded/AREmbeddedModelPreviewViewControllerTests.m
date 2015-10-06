#import "AREmbeddedModelPreviewViewController.h"

SpecBegin(AREmbeddedModelPreviewViewController);


describe(@"iPhone peek", ^{

    it(@"preview view controller displays artwork",^{
        
        Artwork* artwork = [Artwork modelWithJSON:@{
            @"id" : @"artwork-id",
            @"title" : @"Artwork Title",
            @"images" : @[
                    @{@"id": @"image_1_id",
                      @"is_default": @YES,
                      @"image_versions": @[@"large"]},
            ],
        }];
        [artwork updateArtwork];

        AREmbeddedModelPreviewViewController *vc = [[AREmbeddedModelPreviewViewController alloc] initWithObject:artwork];
        [vc updateWithCell:[[UICollectionViewCell alloc] init]];
        
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        [vc.view snapshotViewAfterScreenUpdates:YES];

        expect(vc).to.haveValidSnapshot();
    });

});


SpecEnd;
