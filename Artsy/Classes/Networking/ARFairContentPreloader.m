#import "ARFairContentPreloader.h"
#import <netinet/in.h>
#import <arpa/inet.h>

@interface ARFairContentPreloader () <NSNetServiceBrowserDelegate, NSNetServiceDelegate>
@property (nonatomic, strong) NSNetServiceBrowser *serviceBrowser;
@property (nonatomic, strong) NSNetService *service;
@property (nonatomic, strong) NSString *address;
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

- (void)discoverFairService;
{
  self.serviceBrowser = [NSNetServiceBrowser new];
  self.serviceBrowser.delegate = self;
  [self.serviceBrowser searchForServicesOfType:@"_http._tcp" inDomain:@""];
}

- (void)netServiceBrowser:(NSNetServiceBrowser *)netServiceBrowser
           didFindService:(NSNetService *)service
               moreComing:(BOOL)moreServicesComing;
{
  NSLog(@"SERVICE: %@ MORE: %@", service, @(moreServicesComing));
  if ([service.name isEqualToString:self.serviceName]) {
    self.service = service;
    if (service.addresses.count > 0) {
      [self connectToService];
    } else {
      self.service.delegate = self;
      [self.service resolveWithTimeout:10];
    }
    [self.serviceBrowser stop];
    return;
  }
  if (!moreServicesComing) {
    DDLogDebug(@"Unable to find a Artsy-FairEnough-Server Bonjour service.");
    [self.serviceBrowser stop];
    // TODO Tell delegate to release this object.
  }
}

- (void)netServiceDidResolveAddress:(NSNetService *)service;
{
  if (service.addresses.count > 0) {
    [service stop];
    [self connectToService];
  }
}

- (void)netServiceDidStop:(NSNetService *)service;
{
  NSLog(@"STOPPED/TIMED OUT!");
}

- (void)connectToService;
{
  for (NSData *addressData in self.service.addresses) {
    const struct sockaddr *address = (const struct sockaddr *)addressData.bytes;
    // IPv4
    if (address->sa_family == AF_INET) {
      self.address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)address)->sin_addr)];
      NSLog(@"Found IPv4 address: %@", self.address);
      [self fetchManifest];
    } else if (address->sa_family == AF_INET6) {
      // TODO?
      // NSLog(@"Found IPv6 address");
    } else {
      NSLog(@"Unknown address type");
    }
  }
}

- (void)fetchManifest;
{
  NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithURL:self.manifestURL
                                                           completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
    if (data) {
      NSError *jsonError = nil;
      NSDictionary *manifest = [NSJSONSerialization JSONObjectWithData:data options:0 error:&jsonError];
      if (manifest) {
        NSLog(@"MANIFEST: %@", manifest);
      } else {
        NSLog(@"FAILED TO DESERIALIZE JSON: %@", jsonError);
      }
    } else {
      NSLog(@"FAILED TO FETCH MANIFEST: %@", error);
    }
  }];
  [task resume];
}

- (NSURL *)serviceURL;
{
  if (self.address) {
    return [NSURL URLWithString:[NSString stringWithFormat:@"http://%@:%ld", self.address, (long)self.service.port]];
  }
  return nil;
}

- (NSURL *)manifestURL;
{
  return [self.serviceURL URLByAppendingPathComponent:@"/fair/manifest"];
}

@end
