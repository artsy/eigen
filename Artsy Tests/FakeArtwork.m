#import "FakeArtwork.h"

@interface Artwork (DefferedPrivates)
- (KSDeferred *)deferredSaleArtworkUpdate;
- (KSDeferred *)deferredFairUpdate;
- (KSDeferred *)deferredArtworkUpdate;
@end

@implementation FakeArtwork


- (void)updateSaleArtwork
{
    [self.deferredSaleArtworkUpdate resolveWithValue:self.saleArtwork];
}

- (void)updateArtwork
{
    [self.deferredArtworkUpdate resolveWithValue:self];
}

- (void)updateFair
{
    [self.deferredFairUpdate resolveWithValue:self.fair];
}

@end
