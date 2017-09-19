#import "ARMediaPreviewController.h"

#if __has_include(<Artsy+UIColors/UIColor+ArtsyColors.h>)
#import <Artsy+UIColors/UIColor+ArtsyColors.h>
#else
@import Artsy_UIColors;
#endif

@import MobileCoreServices;
@import QuickLook;
@import ObjectiveC;

static char kARMediaPreviewControllerAssociatedObject;

@interface ARMediaPreviewController () <UIDocumentInteractionControllerDelegate, NSURLSessionDataDelegate>
@property (copy, nonatomic, readonly) NSURL *remoteURL;
@property (copy, nonatomic, readonly) NSString *cacheKey;
@property (copy, nonatomic, readonly) NSString *mimeType;
@property (weak, nonatomic, readonly) UIViewController *hostViewController;
@property (weak, nonatomic, readonly) UIView *originatingView;
@property (weak, nonatomic, readwrite) UIProgressView *progressView;
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

- (void)presentPreview;
{
    if (self.isCached) {
        [self _presentPreview];
    } else {
        [self downloadItemAndShowPreview];
    }
}

- (void)_presentPreview;
{
    dispatch_async(dispatch_get_main_queue(), ^{
        self.documentController = [UIDocumentInteractionController interactionControllerWithURL:self.cachedFileURL];
        self.documentController.delegate = self;
        [self.documentController presentPreviewAnimated:YES];
    });
}

- (void)downloadItemAndShowPreview;
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIProgressView *progressView = [[UIProgressView alloc] initWithProgressViewStyle:UIProgressViewStyleBar];
        progressView.tintColor = [UIColor artsyPurpleRegular];
        self.progressView = progressView;
        CGRect frame = progressView.bounds;
        frame.size.width = CGRectGetWidth(self.originatingView.bounds);
        self.progressView.frame = frame;
        [self.originatingView addSubview:progressView];
    });

    NSURLSessionConfiguration *sessionConfiguration = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:sessionConfiguration
                                                          delegate:self
                                                     delegateQueue:[NSOperationQueue mainQueue]];
    NSURLSessionDownloadTask *task = [session downloadTaskWithURL:self.remoteURL];
    [task resume];
}

#pragma mark - UIDocumentInteractionControllerDelegate

- (UIViewController *)documentInteractionControllerViewControllerForPreview:(UIDocumentInteractionController *)controller;
{
    return self.hostViewController;
}

- (UIView *)documentInteractionControllerViewForPreview:(UIDocumentInteractionController *)controller;
{
    return self.originatingView;
}

#pragma mark - NSURLSessionDelegate

- (void)URLSession:(NSURLSession *)session
      downloadTask:(NSURLSessionDownloadTask *)downloadTask
      didWriteData:(int64_t)bytesWritten
 totalBytesWritten:(int64_t)totalBytesWritten
totalBytesExpectedToWrite:(int64_t)totalBytesExpectedToWrite;
{
    self.progressView.progress = (double)totalBytesWritten / (double)totalBytesExpectedToWrite;
}

- (void)URLSession:(NSURLSession *)session
      downloadTask:(NSURLSessionDownloadTask *)downloadTask
didFinishDownloadingToURL:(NSURL *)location;
{
    StoreCacheFile(location, self.cachedFileURL);
}

- (void)URLSession:(NSURLSession *)session
              task:(NSURLSessionTask *)task
didCompleteWithError:(NSError *)error;
{
    if (error) {
        // TODO: Present error to user?
        NSLog(@"Failed to download attachment: %@", error);
    }

    [self.progressView removeFromSuperview];
    if (self.isCached) {
        [self _presentPreview];
    }
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
