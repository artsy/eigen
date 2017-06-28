#import "ARInquiryComponentViewController.h"

@implementation ARInquiryComponentViewController

- (instancetype)initWithArtworkID:(NSString *)artworkID
{
    // Use the metaphysics defaults for a nil refineSetting
    return [self initWithArtworkID:artworkID emission:nil];
}

- (instancetype)initWithArtworkID:(NSString *)artworkID emission:(AREmission *)emission;
{
    if ((self = [super initWithEmission:emission
                             moduleName:@"Inquiry"
                      initialProperties:@{ @"artworkID": artworkID}])) {
        _artworkID = artworkID;
    }
    return self;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

@end
