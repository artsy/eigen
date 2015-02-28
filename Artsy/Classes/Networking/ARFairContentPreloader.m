#import "ARFairContentPreloader.h"
#import <SSZipArchive/SSZipArchive.h>
#import <netinet/in.h>
#import <arpa/inet.h>

@interface ARFairContentPreloader () <NSNetServiceBrowserDelegate, NSNetServiceDelegate>
@property (nonatomic, strong) NSNetServiceBrowser *serviceBrowser;
@property (nonatomic, strong) NSNetService *service;
@property (nonatomic, strong) NSURL *serviceURL;
@property (nonatomic, strong) NSDictionary *manifest;
@property (nonatomic, assign) BOOL isResolvingService;
@end

@implementation ARFairContentPreloader

+ (instancetype)contentPreloader;
{
  return [[self alloc] initWithServiceName:@"Artsy-FairEnough-Server"];
}

- (instancetype)initWithServiceName:(NSString *)serviceName;
{
   if ((self = [super init])) {
     _serviceName = [serviceName copy];
   }
   return self;
}

#pragma mark - URLs

- (NSURL *)manifestURL;
{
  return [self.serviceURL URLByAppendingPathComponent:@"/fair/manifest.json"];
}

- (NSURL *)packageURL;
{
  return [self.serviceURL URLByAppendingPathComponent:@"/fair/package.zip"];
}

- (NSURL *)temporaryLocalPackageURL;
{
  NSString *filename = [self.fairName stringByAppendingPathExtension:@"zip"];
  return [NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingPathComponent:filename]];
}

- (NSURL *)partiallyDownloadedPackageURL;
{
  return [self.temporaryLocalPackageURL URLByAppendingPathExtension:@"partial"];
}

- (NSURL *)cacheDirectoryURL;
{
  return [NSURL fileURLWithPath:NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES)[0]];
}

- (NSURL *)cachedManifestURL;
{
  NSString *filename = [NSString stringWithFormat:@"%@.FairEnough-manifest.plist", self.fairName];
  return [self.cacheDirectoryURL URLByAppendingPathComponent:filename];
}

#pragma mark - Metadata

- (NSString *)fairName;
{
  return self.manifest[@"fair"];
}

- (NSUInteger)packageSize;
{
  return [self.manifest[@"package-size"] unsignedIntegerValue];
}

- (NSUInteger)unpackedSize;
{
  return [self.manifest[@"unpacked-size"] unsignedIntegerValue];
}

- (NSUInteger)requiredDiskSpace;
{
  return self.packageSize + self.unpackedSize;
}

#pragma mark - Predicates

- (BOOL)hasResolvedService;
{
  return self.service.addresses.count > 0;
}

- (BOOL)hasEnoughFreeDiskSpace;
{
  NSDictionary *attributes = [[NSFileManager defaultManager] attributesOfFileSystemForPath:NSHomeDirectory()
                                                                                     error:nil];
  return [attributes[NSFileSystemFreeSize] unsignedIntegerValue] >= self.requiredDiskSpace;
}

- (BOOL)hasManifest;
{
  return self.manifest != nil;
}

- (BOOL)hasPackage;
{
  return [[NSFileManager defaultManager] fileExistsAtPath:self.temporaryLocalPackageURL.path];
}

- (BOOL)hasPreloadedContent;
{
  if (self.hasManifest && [[NSFileManager defaultManager] fileExistsAtPath:self.cachedManifestURL.path]) {
    NSDictionary *cachedManifest = [NSDictionary dictionaryWithContentsOfURL:self.cachedManifestURL];
    return [self.manifest isEqualToDictionary:cachedManifest];
  }
  return NO;
}

#pragma mark - Bonjour service

- (void)discoverFairService;
{
  self.isResolvingService = YES;
  self.serviceBrowser = [NSNetServiceBrowser new];
  self.serviceBrowser.delegate = self;
  [self.serviceBrowser searchForServicesOfType:@"_http._tcp" inDomain:@""];
}

- (void)netServiceBrowser:(NSNetServiceBrowser *)netServiceBrowser
           didFindService:(NSNetService *)service
               moreComing:(BOOL)moreServicesComing;
{
  ARActionLog(@"[FairEnough] Found Bonjour service: %@", service);
  if ([service.name isEqualToString:self.serviceName]) {
    [self.serviceBrowser stop];
    self.serviceBrowser = nil;

    self.service = service;
    if (self.hasResolvedService) {
      [self resolveAddress];
    } else {
      self.service.delegate = self;
      [self.service resolveWithTimeout:10];
    }
    return;
  }
  if (!moreServicesComing) {
    [self.serviceBrowser stop];
    self.serviceBrowser = nil;
    self.isResolvingService = NO;
  }
}

- (void)netServiceDidResolveAddress:(NSNetService *)service;
{
  if (service.addresses.count > 0) {
    [service stop];
    [self resolveAddress];
  }
}

- (void)netServiceDidStop:(NSNetService *)service;
{
  self.isResolvingService = NO;
  if (!self.hasResolvedService) {
    ARActionLog(@"[FairEnough] Failed to resolve a Artsy-FairEnough-Server Bonjour service.");
  }
}

- (void)resolveAddress;
{
  for (NSData *addressData in self.service.addresses) {
    const struct sockaddr *address = (const struct sockaddr *)addressData.bytes;
    // IPv4
    if (address->sa_family == AF_INET) {
      char *ip = inet_ntoa(((struct sockaddr_in *)address)->sin_addr);
      self.serviceURL = [NSURL URLWithString:[NSString stringWithFormat:@"http://%s:%ld", ip, (long)self.service.port]];
    // } else if (address->sa_family == AF_INET6) {
      // TODO?
      // NSLog(@"Found IPv6 address");
    }
  }
}

#pragma mark - Operations

- (void)fetchManifest:(void(^)(NSError *))completionBlock;
{
  @weakify(self);
  NSURLSessionDataTask *task = nil;
  task = [[NSURLSession sharedSession] dataTaskWithURL:self.manifestURL
                                     completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
    @strongify(self);
    if (!self) return;

    NSInteger statusCode = [(NSHTTPURLResponse *)response statusCode];
    if (statusCode < 200 || statusCode >= 300) {
      ARErrorLog(@"Unexpected response from FairEnough HTTP server: %@", response);
      completionBlock([NSError errorWithDomain:@"ARFairContentPreloaderErrorDomain"
                                          code:statusCode
                                      userInfo:@{ NSLocalizedDescriptionKey:@"Unexpected HTTP status code." }]);
    } else if (data) {
      NSError *jsonError = nil;
      self.manifest = [NSJSONSerialization JSONObjectWithData:data options:0 error:&jsonError];
      if (self.manifest) {
        completionBlock(nil);
      } else {
        completionBlock(jsonError);
      }
    } else {
      completionBlock(error);
    }
  }];
  [task resume];
}

- (void)fetchPackage:(void(^)(NSError *))completionBlock;
{
  NSURL *partiallyDownloadedPackageURL = self.partiallyDownloadedPackageURL;
  NSURL *temporaryLocalPackageURL = self.temporaryLocalPackageURL;

  void (^taskCompletionBlock)(NSURL *, NSURLResponse *, NSError *);
  taskCompletionBlock = ^(NSURL *location, NSURLResponse *response, NSError *error) {
    if (error) {
      NSData *resumeData = error.userInfo[NSURLSessionDownloadTaskResumeData];
      if (resumeData) {
        [resumeData writeToURL:partiallyDownloadedPackageURL atomically:YES];
      }
      completionBlock(error);
    } else {
      [[NSFileManager defaultManager] moveItemAtURL:location toURL:temporaryLocalPackageURL error:&error];
      completionBlock(nil);
    }
  };

  NSURLSessionDownloadTask *task = nil;
  NSData *resumeData = [NSData dataWithContentsOfURL:partiallyDownloadedPackageURL];
  if (resumeData) {
    [[NSFileManager defaultManager] removeItemAtURL:partiallyDownloadedPackageURL error:nil];
    task = [[NSURLSession sharedSession] downloadTaskWithResumeData:resumeData
                                                  completionHandler:taskCompletionBlock];
  } else {
    task = [[NSURLSession sharedSession] downloadTaskWithURL:self.packageURL
                                           completionHandler:taskCompletionBlock];
  }
  // NSAssert(task != nil, @"Expected an instance of NSURLSessionDownloadTask");
  [task resume];
}

- (void)unpackPackage:(void(^)(NSError *))completionBlock;
{
  NSString *sourcePath = self.temporaryLocalPackageURL.path;
  NSString *destinationPath = self.cacheDirectoryURL.path;
  NSDictionary *manifest = self.manifest;
  NSURL *cachedManifestURL = self.cachedManifestURL;
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
    NSError *error = nil;
    if ([SSZipArchive unzipFileAtPath:sourcePath
                        toDestination:destinationPath
                            overwrite:NO
                             password:nil
                                error:&error]) {
      [manifest writeToURL:cachedManifestURL atomically:YES];
      [[NSFileManager defaultManager] removeItemAtPath:sourcePath error:nil]; // TODO deal with error?
    }
    completionBlock(error);
  });
}

- (void)preload:(void(^)(NSError *))completionBlock;
{
  if (self.hasPreloadedContent) {
    completionBlock(nil);
    return;
  }

  @weakify(self);

  void (^handleResult)(NSError *) = ^(NSError *error) {
    if (error) {
      completionBlock(error);
    } else {
      dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
        @strongify(self);
        [self preload:completionBlock];
      });
    }
  };

  if (!self.hasResolvedService) {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
      @strongify(self);
      if (!self) return;

      [self discoverFairService];
      while (self.isResolvingService) {
        CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.25, true);
      }

      NSError *error = nil;
      if (!self.hasResolvedService) {
        NSString *description = @"Unable to resolve a Artsy-FairEnough-Server Bonjour service.";
        error = [NSError errorWithDomain:@"ARFairContentPreloaderErrorDomain"
                                    code:-2
                                userInfo:@{ NSLocalizedDescriptionKey:description }];
      }
      handleResult(error);
    });
  }

  if (!self.hasManifest) {
    [self fetchManifest:handleResult];
  } else if (!self.hasPackage) {
    [self fetchPackage:handleResult];
  } else if (!self.hasPreloadedContent) {
    [self unpackPackage:handleResult];
  } else {
    completionBlock([NSError errorWithDomain:@"ARFairContentPreloaderErrorDomain"
                                        code:-1
                                    userInfo:@{ NSLocalizedDescriptionKey:@"Unexpected state achieved." }]);

  }
}

@end
