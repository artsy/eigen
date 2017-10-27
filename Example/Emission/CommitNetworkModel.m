#import "CommitNetworkModel.h"

// See /scripts/deploy_master.sh

@interface Metadata
- (NSString *)title; // PR description
- (NSString *)sha; // Full SHA of commit used
- (NSString *)date; // ISO8601 string of date for JS upload
- (NSString *)number; // PR number of last merged commit
@end


@implementation CommitNetworkModel

- (NSURL *_Nonnull)fileURLForLatestCommitJavaScript
  {
    return [[[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] firstObject] URLByAppendingPathComponent:@"Emission-master.js"];
  }

- (void)downloadMetadataForMasterCommit:(void (^_Nonnull)(NSError * _Nullable error, NSString * _Nullable title, NSString * _Nullable subtitle))completionHandler
  {
    NSURL *url = [NSURL URLWithString:@"https://s3.amazonaws.com/artsy-emission-js/master-metadata.json"];
      NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithURL:url completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {

        if (error) { completionHandler(error, nil, nil); return; }

        NSError *jsonError = nil;
        Metadata *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&error];

        if (error) { completionHandler(jsonError, nil, nil); return; }
        completionHandler(nil, [json title], [json date]);
//        completionHandler(nil, @"Downloading JS", @"Last PR: #803 Revise deployment and JS strategy across many lines ok");
      }];

      [task resume];
  }

- (void)downloadJavaScriptForMasterCommit:(void (^ _Nonnull)(NSString * _Nullable title, NSString * _Nullable subtitle))metadata completion:(void (^_Nonnull)(NSURL * _Nullable downloadedFileURL, NSError * _Nullable error))completionHandler;
  {
    // Get the metadata first, then grab the master commit if we get metadata correctly
    [self downloadMetadataForMasterCommit:^(NSError * _Nullable error, NSString * _Nullable title, NSString * _Nullable subtitle) {
      if (error) { completionHandler(nil, error); return; }
      dispatch_async(dispatch_get_main_queue(), ^{
        metadata(title, subtitle);
      });

      NSURL *url = [NSURL URLWithString:@"https://s3.amazonaws.com/artsy-emission-js/Emission-master.js"];
      NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithURL:url completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {

        if (error) { completionHandler(nil, error); return; }

        NSURL *fileURL = [self fileURLForLatestCommitJavaScript];
        [data writeToURL:fileURL atomically:YES];

        dispatch_async(dispatch_get_main_queue(), ^{
          completionHandler(fileURL, nil);
        });
      }];

      [task resume];
    }];
  }

@end
