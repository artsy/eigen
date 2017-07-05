#import "ARMediaPreviewController.h"

@import MobileCoreServices;
@import QuickLook;
@import ObjectiveC;

static char kARMediaPreviewControllerAssociatedObject;

@interface ARMediaPreviewController () <UIDocumentInteractionControllerDelegate>
@property (copy, nonatomic, readonly) NSURL *remoteURL;
@property (copy, nonatomic, readonly) NSString *cacheKey;
@property (copy, nonatomic, readonly) NSString *mimeType;

@property (weak, nonatomic, readonly) UIViewController *hostViewController;
@property (weak, nonatomic, readonly) UIView *originatingView;

@property (strong, nonatomic, readwrite) UIDocumentInteractionController *documentController;
@end

@implementation ARMediaPreviewController

- (nonnull instancetype)initWithRemoteURL:(nonnull NSURL *)remoteURL
                                 mimeType:(nonnull NSString *)mimeType
                                 cacheKey:(nullable NSString *)cacheKey
                       hostViewController:(nonnull UIViewController *)hostViewController
                          originatingView:(nonnull UIView *)originatingView;
{
    if ((self = [super init])) {
        _remoteURL = remoteURL;
        _mimeType = mimeType;
        _cacheKey = cacheKey ?: [remoteURL.absoluteString stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet alphanumericCharacterSet]];
        _hostViewController = hostViewController;
        _originatingView = originatingView;
    }
    return self;
}

- (void)presentPreviewAnimated:(BOOL)animated;
{
    __weak typeof(self) weakSelf = self;
    dispatch_block_t showPreview = ^{
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (strongSelf) {
            NSURL *fileURL = strongSelf.cachedFileURL;
            strongSelf.documentController = [UIDocumentInteractionController interactionControllerWithURL:fileURL];
            strongSelf.documentController.delegate = strongSelf;
            [strongSelf.documentController presentPreviewAnimated:animated];
        }
    };
    
    if (self.isCached) {
        showPreview();
    } else {
        [self downloadItem:showPreview];
    }
}

- (void)downloadItem:(dispatch_block_t)completion;
{
    NSURL *cachedFileURL = self.cachedFileURL;
    NSURLSessionDownloadTask *task = [[NSURLSession sharedSession] downloadTaskWithURL:self.remoteURL
                                                                     completionHandler:^(NSURL * _Nullable location,
                                                                                         id _,
                                                                                         NSError * _Nullable error) {
        if (location) {
            StoreCacheFile(location, cachedFileURL);
            dispatch_async(dispatch_get_main_queue(), completion);
        } else if (error) {
            // TODO present error
            NSLog(@"ERROR: %@", error);
        } else {
            NSCAssert(NO, @"TODO: generate an error ourselves?");
        }
    }];
    
    [task resume];
}

- (UIViewController *)documentInteractionControllerViewControllerForPreview:(UIDocumentInteractionController *)controller;
{
    return self.hostViewController;
}

- (UIView *)documentInteractionControllerViewForPreview:(UIDocumentInteractionController *)controller;
{
    return self.originatingView;
}

#pragma mark - associated object

+ (nonnull instancetype)mediaPreviewControllerWithRemoteURL:(nonnull NSURL *)remoteURL
                                                   mimeType:(nonnull NSString *)mimeType
                                                   cacheKey:(nullable NSString *)cacheKey
                                         hostViewController:(nonnull UIViewController *)hostViewController
                                            originatingView:(nonnull UIView *)originatingView;
{
    ARMediaPreviewController *controller = [[self alloc] initWithRemoteURL:remoteURL
                                                                  mimeType:mimeType
                                                                  cacheKey:cacheKey
                                                        hostViewController:hostViewController
                                                           originatingView:originatingView];
    objc_setAssociatedObject(hostViewController,
                             &kARMediaPreviewControllerAssociatedObject,
                             controller,
                             OBJC_ASSOCIATION_RETAIN);
    
    return controller;
}

- (void)documentInteractionControllerDidEndPreview:(UIDocumentInteractionController *)controller;
{
    __strong UIViewController *hostViewController = self.hostViewController;
    if (hostViewController) {
        objc_setAssociatedObject(hostViewController,
                                 &kARMediaPreviewControllerAssociatedObject,
                                 nil,
                                 OBJC_ASSOCIATION_RETAIN);
    }
}

#pragma mark - caching

static void
StoreCacheFile(NSURL *tmp, NSURL *dest)
{
    NSError *error = nil;
    NSString *cacheDir = CacheDir();
    if (![[NSFileManager defaultManager] fileExistsAtPath:cacheDir]) {
        [[NSFileManager defaultManager] createDirectoryAtPath:cacheDir
                                  withIntermediateDirectories:YES
                                                   attributes:nil
                                                        error:&error];
    }
    NSCAssert(error == nil, @"Unable to create cache dir: %@", error);
    [[NSFileManager defaultManager] moveItemAtURL:tmp toURL:dest error:&error];
    NSCAssert(error == nil, @"Unable to move item: %@", error);
}

static NSString *
CacheDir(void)
{
    NSArray<NSString *> *cacheDirs = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
    return [cacheDirs[0] stringByAppendingPathComponent:@"MessageAttachments"];
}

- (BOOL)isCached;
{
    return [[NSFileManager defaultManager] fileExistsAtPath:self.cachedFileURL.path];
}

- (NSURL *)cachedFileURL;
{
    CFStringRef uti = UTTypeCreatePreferredIdentifierForTag(kUTTagClassMIMEType, (__bridge CFStringRef)self.mimeType, NULL);
    NSString *fileExt = (NSString *)CFBridgingRelease(UTTypeCopyPreferredTagWithClass(uti, kUTTagClassFilenameExtension));
    CFRelease(uti);
    NSParameterAssert(fileExt);
    NSString *filename = [self.cacheKey stringByAppendingPathExtension:fileExt];
    return [NSURL fileURLWithPath:[CacheDir() stringByAppendingPathComponent:filename]];
}

@end
