#import "ARWatchArtworkSetViewController.h"
#import "WatchArtwork.h"
#import "WKInterfaceImage+Async.h"
#import "ARWatchAsyncTableViewController.h"

@implementation ARWatchArtworkRowController
@end

@interface ARWatchArtworkSetViewController()
@property (nonatomic, readonly, strong) ARWatchAsyncTableViewController *controller;
@end

@implementation ARWatchArtworkSetViewController

- (void)awakeWithContext:(id)context
{
    ARWatchAsyncTableViewController *controller = [[ARWatchAsyncTableViewController alloc] initWithTableView:self.table dataArray:context];

    __weak ARWatchAsyncTableViewController *weakController = controller;
    _controller = controller;

    controller.updateRow = ^(ARWatchArtworkRowController *row, WatchArtwork *artwork, NSInteger index) {
        row.artistTitle.text = artwork.artistName.uppercaseString;
        row.artworkTitle.attributedText = artwork.titleAndDateAttributedString;

        [row.thumbnailImage ar_asyncSetImageURL:artwork.thumbnailImageURL completion:^{
            if (index == 1) {
                [weakController finishUp];
            }
        }];
    };
    [controller start];
}

@end
