#import <UIKit/UIKit.h>


@interface ARURLItemProvider : UIActivityItemProvider

@property (nonatomic, strong, readonly) NSString *message;
@property (nonatomic, strong, readonly) NSURL *thumbnailImageURL;
@property (nonatomic, strong, readonly) UIImage *thumbnailImage;

- (instancetype)initWithMessage:(NSString *)message path:(NSString *)path thumbnailImageURL:(NSURL *)thumbnailImageURL;

@end
