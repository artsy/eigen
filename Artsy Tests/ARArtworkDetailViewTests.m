#import "ARArtworkDetailView.h"
#import <FBSnapshotTestCase/FBSnapshotTestController.h>

SpecBegin(ARArtworkDetailView)

it(@"displays both cm and in dimensions", ^{
    Artwork *artwork = [Artwork modelWithJSON:@{
          @"dimensions" : @{
            @"cm":@"100 cm big",
            @"in":@"100 inches big",
          }
    }];

    ARArtworkDetailView *view = [[ARArtworkDetailView alloc] initWithArtwork:nil andFair:nil];
    view.frame = (CGRect){ 0, 0, 320, 80 };
    [view updateWithArtwork:artwork];

    expect(view).to.haveValidSnapshotNamed(@"bothDimensions");
});

SpecEnd
