/// Centralized sharing / tweeter / tracebooking point

@interface ARSharingController : NSObject

+ (instancetype)sharingControllerWithObject:(id)object thumbnailImageURL:(NSURL *)thumbnailImageURL;
+ (instancetype)sharingControllerWithObject:(id)object thumbnailImageURL:(NSURL *)thumbnailImageURL image:(UIImage *)image;

- (NSString *)objectID;
- (void)presentActivityViewControllerFromButton:(UIButton *)button;

@property (nonatomic, readonly) id <ARShareableObject> object;

@end
