#import "ARGeneArtworksNetworkModel.h"

#import "Gene.h"


@interface ARGeneArtworksNetworkModel ()
@property (nonatomic, assign) NSInteger currentPage;
@property (readwrite, nonatomic, assign) BOOL allDownloaded;
@property (readwrite, nonatomic, assign) BOOL downloadLock;
@end


@implementation ARGeneArtworksNetworkModel

- (id)initWithGene:(Gene *)gene
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _gene = gene;
    _currentPage = 1;

    return self;
}

- (void)getNextArtworkPage:(void (^)(NSArray *artworks))success
{
    if (self.allDownloaded || self.downloadLock) {
        return;
    }

    self.downloadLock = YES;

   __weak typeof (self) wself = self;

    [self.gene getArtworksAtPage:self.currentPage success:^(NSArray *artworks) {
        __strong typeof (wself) sself = wself;
        if (!sself) { return; }

        self.currentPage++;
        self.downloadLock = NO;

        if (artworks.count == 0) {
            self.allDownloaded = YES;
        }

        if(success) { success(artworks); }
    }];
}

@end
