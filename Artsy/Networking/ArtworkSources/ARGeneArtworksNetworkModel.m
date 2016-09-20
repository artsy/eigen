#import "ARGeneArtworksNetworkModel.h"
#import "ArtsyAPI+Genes.h"
#import "Artsy-Swift.h"


@interface ARGeneArtworksNetworkModel ()
@property (nonatomic, assign) NSInteger currentPage;
@property (nonatomic, strong, readwrite) Gene *gene;
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

- (id)initWithGeneID:(NSString *)geneID
{
    return [self initWithGene:[[Gene alloc] initWithGeneID:geneID]];
}

- (void)getGene:(void (^)(GeneViewModel *viewModel))success
{
    __weak typeof(self) wself = self;
    [ArtsyAPI getGeneForGeneID:self.gene.geneID success:^(Gene *gene) {
        __strong typeof (wself) sself = wself;
        sself.gene = gene;
        success([[GeneViewModel alloc] initWithGene:gene]);
    } failure:nil];
}

- (void)getNextArtworkPage:(void (^)(NSArray *artworks))success
{
    if (self.allDownloaded || self.downloadLock) {
        return;
    }

    self.downloadLock = YES;

    __weak typeof(self) wself = self;

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

- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure
{
    [self.gene getFollowState:success failure:failure];
}

- (void)setFollowState:(BOOL)state success:(void (^)(id))success failure:(void (^)(NSError *))failure
{
    [self.gene setFollowState:state success:success failure:failure];
}


@end
