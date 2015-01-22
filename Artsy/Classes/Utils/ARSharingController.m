#import "ARSharingController.h"
#import "ARURLItemProvider.h"
#import "ARImageItemProvider.h"
#import "ARMessageItemProvider.h"
#import <UIAlertView+Blocks/UIAlertView+Blocks.h>

@interface ARSharingController ()
@property (nonatomic, strong) id <ARShareableObject> object;
@property (nonatomic, strong) ARURLItemProvider *urlProvider;
@property (nonatomic, strong) ARImageItemProvider *imageProvider;
@property (nonatomic, strong) ARMessageItemProvider *messageProvider;
@end

@implementation ARSharingController

+ (void)shareObject:(id)object
{
    return [self shareObject:object withThumbnailImageURL:nil withImage:nil];
}

+ (void)shareObject:(id)object withThumbnailImageURL:(NSURL *)thumbnailImageURL
{
    return [self shareObject:object withThumbnailImageURL:thumbnailImageURL withImage:nil];
}

+ (void)shareObject:(id)object withThumbnailImageURL:(NSURL *)thumbnailImageURL withImage:(UIImage *)image
{
    ARSharingController *sharingController = [[self alloc] initWithObject:object];
    [sharingController shareWithThumbnailImageURL:thumbnailImageURL image:image];
}

- (instancetype)initWithObject:(id)object
{
    self = [super init];
    if (!self) { return nil; }
    _object = object;
    return self;
}

- (void)shareWithThumbnailImageURL:(NSURL *)thumbnailImageURL image:(UIImage *)image
{
    _messageProvider = [[ARMessageItemProvider alloc] initWithMessage:self.message path:[self.object publicArtsyPath]];
    _urlProvider = [[ARURLItemProvider alloc] initWithMessage:self.message path:[self.object publicArtsyPath] thumbnailImageURL:thumbnailImageURL];
    _imageProvider = [[ARImageItemProvider alloc] initWithPlaceholderItem:image];
    [self presentActivityViewController];
}

- (void)presentActivityViewController
{
    if (ARIsRunningInDemoMode) {
        [UIAlertView showWithTitle:nil message:@"Feature not enabled for this demo" cancelButtonTitle:@"OK" otherButtonTitles:nil tapBlock:nil];
        return;
    }

    ARTopMenuViewController *topMenuVC = [ARTopMenuViewController sharedController];
    UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:[self activityItems] applicationActivities:nil];

    activityVC.excludedActivityTypes = @[
        UIActivityTypePostToWeibo,
        UIActivityTypePrint,
        UIActivityTypeAssignToContact,
        UIActivityTypeSaveToCameraRoll,
        UIActivityTypePostToFlickr,
        UIActivityTypePostToVimeo,
        UIActivityTypePostToTencentWeibo
    ];

    activityVC.completionHandler = ^(NSString *activityType, BOOL completed) {
        [self handleActivityCompletion:activityType completed:completed];
    };

    [topMenuVC presentViewController:activityVC animated:YES completion:nil];
}

- (void)handleActivityCompletion:(NSString *)activityType completed:(BOOL)completed
{
    // Required for analytics
}

// ARMessageItemProvider will add the appropriate " on Artsy:", " on Artsy", " on @Artsy", etc to message.
- (NSString *)message
{
    if (self.object.class == [Artwork class]){
        Artwork *artwork = (Artwork *)self.object;
        if (artwork.artist.name.length) {
            return [NSString stringWithFormat:@"\"%@\" by %@", artwork.title, artwork.artist.name];
        } else {
            return [NSString stringWithFormat:@"\"%@\"", artwork.title];
        }
    } else if (self.object.class == [PartnerShow class]) {
        return [NSString stringWithFormat:@"See %@", self.object.name];
    } else {
        return self.object.name;
    }
}

- (NSString *)objectID
{
    if (self.object.class == [Artwork class]) {
        return [(Artwork *) self.object artworkID];
    } else if (self.object.class == [Artist class]) {
        return [(Artist *) self.object artistID];
    } else if (self.object.class == [Gene class]) {
        return [(Gene *) self.object geneID];
    } else if (self.object.class == [PartnerShow class]) {
        return [(PartnerShow *) self.object showID];
    } else {
        return nil;
    }
}

- (NSArray *)activityItems
{
    return @[
        self.messageProvider,
        self.urlProvider,
        self.imageProvider
    ];
}

@end
