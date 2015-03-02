#import "ARSharingController.h"
#import "ARURLItemProvider.h"
#import "ARImageItemProvider.h"
#import "ARMessageItemProvider.h"
#import <UIAlertView+Blocks/UIAlertView+Blocks.h>

@interface ARSharingController ()
@property (nonatomic, strong) id <ARShareableObject> object;
@property (nonatomic, strong) NSURL *thumbnailImageURL;
@property (nonatomic, strong) UIImage *image;
@end

@implementation ARSharingController

+ (instancetype)sharingControllerWithObject:(id)object thumbnailImageURL:(NSURL *)thumbnailImageURL;
{
    return [self sharingControllerWithObject:object thumbnailImageURL:thumbnailImageURL image:nil];
}

+ (instancetype)sharingControllerWithObject:(id)object thumbnailImageURL:(NSURL *)thumbnailImageURL image:(UIImage *)image;
{
    return [[self alloc] initWithObject:object thumbnailImageURL:thumbnailImageURL image:image];
}

- (instancetype)initWithObject:(id)object thumbnailImageURL:(NSURL *)thumbnailImageURL image:(UIImage *)image;
{
    if ((self = [super init])) {
        _object = object;
        _thumbnailImageURL = thumbnailImageURL;
        _image = image;
    }
    return self;
}

- (void)presentActivityViewControllerFromView:(UIView *)view;
{
    if (ARIsRunningInDemoMode) {
        [UIAlertView showWithTitle:nil message:@"Feature not enabled for this demo" cancelButtonTitle:@"OK" otherButtonTitles:nil tapBlock:nil];
        return;
    }

    UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:self.activityItems applicationActivities:nil];

    activityVC.excludedActivityTypes = @[
        UIActivityTypePostToWeibo,
        UIActivityTypePrint,
        UIActivityTypeAssignToContact,
        UIActivityTypeSaveToCameraRoll,
        UIActivityTypePostToFlickr,
        UIActivityTypePostToVimeo,
        UIActivityTypePostToTencentWeibo
    ];

    // Declare it here so it can be accessed from the UIActivityViewController's completionHandler.
    UIPopoverController *popover = nil;

    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone) {
        [[ARTopMenuViewController sharedController] presentViewController:activityVC animated:YES completion:nil];
    } else {
        UIPopoverController *popover = [[UIPopoverController alloc] initWithContentViewController:activityVC];
        [popover presentPopoverFromRect:view.bounds
                                 inView:view
               permittedArrowDirections:UIPopoverArrowDirectionAny
                               animated:YES];
    }

    activityVC.completionHandler = ^(NSString *activityType, BOOL completed) {
        [popover dismissPopoverAnimated:YES];
        [self handleActivityCompletion:activityType completed:completed];
    };
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

- (ARURLItemProvider *)urlProvider;
{
    return [[ARURLItemProvider alloc] initWithMessage:self.message path:self.object.publicArtsyPath thumbnailImageURL:self.thumbnailImageURL];
}

- (ARImageItemProvider *)imageProvider;
{
    return [[ARImageItemProvider alloc] initWithPlaceholderItem:self.image];
}

- (ARMessageItemProvider *)messageProvider;
{
    return [[ARMessageItemProvider alloc] initWithMessage:self.message path:self.object.publicArtsyPath];
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
