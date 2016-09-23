#import "AREmbeddedModelPreviewViewController.h"
#import "ARSharingController.h"
#import "ARUserManager.h"
#import "ARUserManager+Stubs.h"
#import "ArtsyOHHTTPAPI.h"


@interface AREmbeddedModelPreviewViewController (Tests)
- (NSArray<id<UIPreviewActionItem>> *)previewActionItems;
- (ARSharingController *)sharingController;
@property (nonatomic, strong, readwrite) id<ARShareableObject> object;
@end


SpecBegin(AREmbeddedModelPreviewViewController);

__block Artwork *artwork;

describe(@"iPhone peek", ^{
    
    beforeEach(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets" withResponse:@{}];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@{}];

        artwork = [Artwork modelWithJSON:@{
            @"id" : @"artwork-id",
            @"title" : @"Artwork Title",
            @"artist" : @{
                @"name" : @"Jory Stiefel"
            }
        }];
    });

    it(@"preview view controller displays artwork",^{
        
        AREmbeddedModelPreviewViewController *vc = [[AREmbeddedModelPreviewViewController alloc] initWithObject:artwork];
        [vc updateWithCell:[[UICollectionViewCell alloc] init]];
    
        expect(vc).to.haveValidSnapshot();
    });

    it(@"shows favorite and follow buttons for logged in user", ^{

        [ARUserManager stubAndLoginWithUsername];
        XCTAssert([User currentUser] != nil, @"Current user is nil even after stubbing.");
        
        AREmbeddedModelPreviewViewController *vc = [[AREmbeddedModelPreviewViewController alloc] initWithObject:artwork];
        NSArray <id<UIPreviewActionItem>> *previewActions = [vc previewActionItems];
    
        expect(previewActions[0].title).to.startWith(@"Favorite");
        expect(previewActions[1].title).to.startWith(@"Follow");
    });
    
    it(@"passes artwork to share controller", ^{
        
        AREmbeddedModelPreviewViewController *vc = [[AREmbeddedModelPreviewViewController alloc] initWithObject:artwork];
        [vc updateWithCell:[[UICollectionViewCell alloc] init]];
        ARSharingController *sharingController = [vc sharingController];
        
        expect(sharingController.object).to.equal(artwork);
        expect([sharingController.object name]).to.equal(artwork.title);
    });
});


SpecEnd;
