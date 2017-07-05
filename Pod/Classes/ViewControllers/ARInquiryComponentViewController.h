#import <Emission/ARComponentViewController.h>

@interface ARInquiryComponentViewController : ARComponentViewController

@property (nonatomic, strong, readonly) NSString *artworkID;

- (instancetype)initWithArtworkID:(NSString *)artworkID;

- (instancetype)initWithArtworkID:(NSString *)artworkID
                      emission:(nullable AREmission *)emission NS_DESIGNATED_INITIALIZER;


@end
