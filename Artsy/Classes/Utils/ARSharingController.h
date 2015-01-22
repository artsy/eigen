/// Centralized sharing / tweeter / tracebooking point

@interface ARSharingController : NSObject

+ (void)shareObject:(id)object;
+ (void)shareObject:(id)object withThumbnailImageURL:(NSURL *)thumbnailImageURL;
+ (void)shareObject:(id)object withThumbnailImageURL:(NSURL *)thumbnailImageURL withImage:(UIImage *)image;

- (NSString *)objectID;

@property (nonatomic, strong, readonly) id <ARShareableObject> object;

@end
