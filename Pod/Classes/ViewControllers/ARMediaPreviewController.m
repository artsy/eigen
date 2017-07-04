#import "ARMediaPreviewController.h"
#import "ARSpinner.h"

@import MobileCoreServices;
@import QuickLook;

@interface ARMediaPreviewController () <QLPreviewControllerDataSource>
@property (copy, nonatomic, readonly) NSURL *remoteURL;
@property (copy, nonatomic, readonly) NSString *cacheKey;
@property (copy, nonatomic, readonly) NSString *mimeType;
@end

@implementation ARMediaPreviewController

- (instancetype)initWithRemoteURL:(nonnull NSURL *)remoteURL
                         mimeType:(nonnull NSString *)mimeType
                         cacheKey:(nullable NSString *)cacheKey;
{
    if ((self = [super init])) {
        _remoteURL = remoteURL;
        _mimeType = mimeType;
        _cacheKey = cacheKey ?: [remoteURL.absoluteString stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet alphanumericCharacterSet]];
    }
    return self;
}

- (void)loadView;
{
    self.view = [UIView new];
    
    if (self.isCached) {
        [self showPreview];
    } else {
        [self downloadAndShowPreview];
    }
}

- (void)downloadAndShowPreview;
{
    __weak ARSpinner *spinner = [self showSpinner];
    __weak typeof(self) weakSelf = self;
    NSURL *cachedFileURL = self.cachedFileURL;
    
    NSURLSessionDownloadTask *task = [[NSURLSession sharedSession] downloadTaskWithURL:self.remoteURL
                                                                     completionHandler:^(NSURL * _Nullable location, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (location) {
            // Always save the downloaded file, including when the view controller may have been dimissed again.
            NSError *error = nil;
            NSString *cacheDir = [ARMediaPreviewController cacheDir];
            if (![[NSFileManager defaultManager] fileExistsAtPath:cacheDir]) {
                [[NSFileManager defaultManager] createDirectoryAtPath:cacheDir
                                          withIntermediateDirectories:YES
                                                           attributes:nil
                                                                error:&error];
            }
            NSAssert(error == nil, @"Unable to create cache dir: %@", error);
            [[NSFileManager defaultManager] moveItemAtURL:location toURL:cachedFileURL error:&error];
            NSAssert(error == nil, @"Unable to move item: %@", error);
            
            __strong typeof(weakSelf) strongSelf = weakSelf;
            if (strongSelf) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    [spinner removeFromSuperview];
                    [strongSelf showPreview];
                });
            }
        } else if (error) {
            // TODO present error
            NSLog(@"ERROR: %@", error);
        } else {
            NSAssert(NO, @"TODO: generate an error ourselves?");
        }
    }];
    
    [task resume];
}

- (BOOL)isCached;
{
    return [[NSFileManager defaultManager] fileExistsAtPath:self.cachedFileURL.path];
}

+ (NSString *)cacheDir;
{
    NSArray<NSString *> *cacheDirs = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
    return [cacheDirs[0] stringByAppendingPathComponent:@"MessageAttachments"];
}

- (NSURL *)cachedFileURL;
{
    CFStringRef uti = UTTypeCreatePreferredIdentifierForTag(kUTTagClassMIMEType, (__bridge CFStringRef)self.mimeType, NULL);
    NSString *fileExt = (NSString *)CFBridgingRelease(UTTypeCopyPreferredTagWithClass(uti, kUTTagClassFilenameExtension));
    CFRelease(uti);
    NSParameterAssert(fileExt);
    NSString *filename = [self.cacheKey stringByAppendingPathExtension:fileExt];
    return [NSURL fileURLWithPath:[self.class.cacheDir stringByAppendingPathComponent:filename]];
}

- (ARSpinner *)showSpinner;
{
    ARSpinner *spinner = [ARSpinner new];
    [spinner startAnimating];
    [self.view addSubview:spinner];
    
    spinner.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addConstraints:@[
        [NSLayoutConstraint constraintWithItem:spinner
                                     attribute:NSLayoutAttributeTop
                                     relatedBy:NSLayoutRelationEqual
                                        toItem:self.topLayoutGuide
                                     attribute:NSLayoutAttributeBottom
                                    multiplier:1
                                      constant:0],
        [NSLayoutConstraint constraintWithItem:spinner
                                     attribute:NSLayoutAttributeLeading
                                     relatedBy:NSLayoutRelationEqual
                                        toItem:self.view
                                     attribute:NSLayoutAttributeLeading
                                    multiplier:1
                                      constant:0],
        [NSLayoutConstraint constraintWithItem:spinner
                                     attribute:NSLayoutAttributeTrailing
                                     relatedBy:NSLayoutRelationEqual
                                        toItem:self.view
                                     attribute:NSLayoutAttributeTrailing
                                    multiplier:1
                                      constant:0],
        [NSLayoutConstraint constraintWithItem:spinner
                                     attribute:NSLayoutAttributeBottom
                                     relatedBy:NSLayoutRelationEqual
                                        toItem:self.bottomLayoutGuide
                                     attribute:NSLayoutAttributeTop
                                    multiplier:1
                                      constant:0],
        ]];
    
    return spinner;
}

- (void)showPreview;
{
    // TODO: Sigh… Auto Layout issues
    // [self.view removeConstraints:self.view.constraints];
    
    QLPreviewController *previewController = [QLPreviewController new];
    previewController.dataSource = self;
    //    previewController.delegate = self;
    
    [self addChildViewController:previewController];
    [self.view addSubview:previewController.view];
    
    previewController.view.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addConstraints:@[
        [NSLayoutConstraint constraintWithItem:previewController.view
                                     attribute:NSLayoutAttributeTop
                                     relatedBy:NSLayoutRelationEqual
                                        toItem:self.topLayoutGuide
                                     attribute:NSLayoutAttributeBottom
                                    multiplier:1
                                      constant:0],
        [NSLayoutConstraint constraintWithItem:previewController.view
                                     attribute:NSLayoutAttributeLeading
                                     relatedBy:NSLayoutRelationEqual
                                        toItem:self.view
                                     attribute:NSLayoutAttributeLeading
                                    multiplier:1
                                      constant:0],
        [NSLayoutConstraint constraintWithItem:previewController.view
                                     attribute:NSLayoutAttributeTrailing
                                     relatedBy:NSLayoutRelationEqual
                                        toItem:self.view
                                     attribute:NSLayoutAttributeTrailing
                                    multiplier:1
                                      constant:0],
        [NSLayoutConstraint constraintWithItem:previewController.view
                                     attribute:NSLayoutAttributeBottom
                                     relatedBy:NSLayoutRelationEqual
                                        toItem:self.bottomLayoutGuide
                                     attribute:NSLayoutAttributeTop
                                    multiplier:1
                                      constant:0],
        ]];
    
    [previewController didMoveToParentViewController:self];
}

#pragma mark - QLPreviewControllerDataSource

- (NSInteger)numberOfPreviewItemsInPreviewController:(QLPreviewController *)controller;
{
    return 1;
}

- (id <QLPreviewItem>)previewController:(QLPreviewController *)controller previewItemAtIndex:(NSInteger)index;
{
    return self.cachedFileURL;
}

@end
