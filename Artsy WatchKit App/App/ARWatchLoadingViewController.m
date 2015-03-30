#import "ARWatchLoadingViewController.h"
#import "ARWatchNoResultsViewController.h"
#import "WatchMessage.h"
#import "WatchArtwork.h"
#import "WatchShow.h"
#import "NSArray+ObjectiveSugar.h"

static BOOL ARShouldUseArtworksTableView = YES;
static BOOL ARShouldUseShowsTableView = YES;

@interface ARWatchLoadingViewController()
@property (nonatomic, readonly, strong) WatchMessage *message;
@property (nonatomic, readonly, assign) BOOL loaded;
@end

@implementation ARWatchLoadingViewController

- (void)awakeWithContext:(WatchMessage *)context
{
    _message = context;

    [self.loadingIndicator setImageNamed:@"Progress-Spinner-"];
    [self.loadingIndicator startAnimatingWithImagesInRange:NSMakeRange(0, 59) duration:0.8 repeatCount:0];

    switch (self.message.action) {
        case ARWatchMessageRequestShows:
            self.titleLabel.text = @"Loading Shows";
            break;

        case ARWatchMessageRequestWorksForYou:
            self.titleLabel.text = @"Loading New Works By Artists You Follow";
            break;

        case ARWatchMessageRequestFavorites:
            self.titleLabel.text = @"Loading Favorites";
            break;


        case ARWatchMessageRequestRecommended:
            self.titleLabel.text = @"Loading Reccommendations";
            break;

        case ARWatchMessageRequestBid:
            self.titleLabel.text = @"Loading Your Bid";
    }

    [self.class openParentApplication:self.message.dictionaryRepresentation reply:^(NSDictionary *replyInfo, NSError *error) {

        if (replyInfo == nil) {
            NSLog(@"Likely a problem with the phone app, check the log.");
        }

        // Expects a WatchMessage +messageWithArtworks, +messageWithArtworks or +messageWithError returned
        WatchMessage *response = [[WatchMessage alloc] initWithDictionary:replyInfo];

        // Error is @(-1) if absent
        if ([response.error isKindOfClass:NSString.class]) {
            [self handleError:response.error];
            return;
        }

        NSArray *watchModels = [response.referenceObject map:^id(id object) {
            return [[self.classForModel alloc] initWithDictionary:object];
        }];

        // Likely a network error
        if (!watchModels) {
            self.titleLabel.text = @"Please try on your phone.";
            [self.loadingIndicator setImageNamed:@"BidFailed"];
            return;
        }

        // No local shows, or no favourited works yet
        if (watchModels.count == 0) {
            NSDictionary *context = [self noModelsContext];
            [self pushControllerWithName:@"No Results" context:context];
            return;
        }

        self.titleLabel.text = @"";
        self.loadingIndicator.hidden = YES;

        if (self.representsShowMessage) {
            [self showShows:watchModels];
        } else {
            [self showArtworks:watchModels];
        }
    }];
}

- (void)willActivate
{
    [super willActivate];

    if (self.loaded) {
        [self popToRootController];
        return;
    }
    _loaded = YES;
}

- (void)handleError:(id )error
{
    [self.loadingIndicator setImageNamed:@"BidFailed"];

    if ([error isEqualToString:@"net.artsy.shows.no_auth"]) {
        self.titleLabel.text = @"Please visit Shows Around Me on your phone.";

    } else {
        self.titleLabel.text = @"Had trouble connecting to Artsy.";
    }
}

- (void)showShows:(NSArray *)shows
{
    if (ARShouldUseShowsTableView) {
        [self pushControllerWithName:@"Shows Set" context:shows];
    } else {
        NSArray *names = [self arrayWithString:@"Show" duplicatedTimes:shows.count];
        [self presentControllerWithNames:names contexts:shows];
    }
}

- (void)showArtworks:(NSArray *)artworks
{
    if (ARShouldUseArtworksTableView) {
        [self loadTableViewArtworks:artworks];
    } else {
        [self loadPagingArtworks:artworks];
    }
}

- (BOOL)representsShowMessage
{
    return self.message.action == ARWatchMessageRequestShows;
}

- (Class)classForModel
{
    return self.representsShowMessage ? WatchShow.class : WatchArtwork.class;
}

- (void)loadTableViewArtworks:(NSArray *)artworks
{
    [self pushControllerWithName:@"Artwork Table" context:artworks];
}

- (void)loadPagingArtworks:(NSArray *)artworks
{
    NSArray *names = [self arrayWithString:@"Artwork" duplicatedTimes:artworks.count];
    [self presentControllerWithNames:names contexts:artworks];
}

- (NSArray *)arrayWithString:(NSString *)string duplicatedTimes:(NSInteger)i
{
    NSMutableArray *items = [NSMutableArray array];
    while ([items count] < i) {
        [items addObject: string];
    }
    return [NSArray arrayWithArray:items];
}

- (NSDictionary *)noModelsContext
{
    if (self.representsShowMessage) {
        return [ARWatchNoResultsViewController contextWithTitle:@"No local \nshows found" subtitle:@"We only find active shows, try again later."];
    } else {
        return [ARWatchNoResultsViewController contextWithTitle:@"You have no favorites" subtitle:@"Go and explore, it's a big world."];
    }
}

@end
