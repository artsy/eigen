#import "PRNetworkModel.h"

@implementation PRNetworkModel

- (void)getPRs:(void (^_Nonnull)(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error))completionHandler
{
  NSURL *prListURL = [NSURL URLWithString:@"https://api.github.com/repos/artsy/emission/pulls"];
  NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithURL:prListURL completionHandler:completionHandler];
  [task resume];
}

- (void)verifyJSAtPRNumber:(NSUInteger)number completion:(void (^_Nonnull)(BOOL exists))completionHandler
{
  NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"https://s3.amazonaws.com/artsy-emission-js/%@.js", @(number)]];
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
  request.HTTPMethod = @"HEAD";

  NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    NSHTTPURLResponse *httpResponse = (id)response;
    NSInteger code = httpResponse.statusCode;

    completionHandler(code == 200);
  }];

  [task resume];
}

- (NSURL *_Nonnull)fileURLForPRJavaScript
{
  return [[[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] firstObject] URLByAppendingPathComponent:@"Emission-PR.js"];
}

- (void)downloadJavaScriptForPRNumber:(NSUInteger)number completion:(void (^_Nonnull)(NSURL * _Nullable downloadedFileURL, NSError * _Nullable error))completionHandler;
{
  NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"https://s3.amazonaws.com/artsy-emission-js/%@.js", @(number)]];
  NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithURL:url completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    if(error) {
      completionHandler(nil, error);
      return;
    }

    NSURL *fileURL = [self fileURLForPRJavaScript];
    [data writeToURL:fileURL atomically:YES];
    completionHandler(fileURL, nil);
  }];
  [task resume];
}

@end
