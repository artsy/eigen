#import "ARWatchArtworkViewController.h"
#import "WatchArtwork.h"
#import "WKInterfaceImage+Async.h"

@interface ARWatchArtworkViewController()
@property (nonatomic, readonly, strong) WatchArtwork *artwork;
@property (nonatomic, readonly, assign) BOOL loaded;
@end

@implementation ARWatchArtworkViewController

- (void)awakeWithContext:(id)context
{
    _artwork = context;

    // No viewDidLoad vs viewWillAppear:
    if (self.loaded) return;
    _loaded = YES;

    [self.artistNameLabel setText:self.artwork.artistName.uppercaseString];
    [self.artworkTitleLabel setAttributedText:self. artwork.titleAndDateAttributedString];
    [self.mainImage ar_asyncSetImageURL:self.artwork.thumbnailImageURL];
}

- (IBAction)openArtworkOnPhone
{
    
}

@end



