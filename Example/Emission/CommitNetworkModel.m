#import "CommitNetworkModel.h"


@implementation CommitNetworkModel

- (NSURL *_Nonnull)fileURLForLatestCommitJavaScript
  {
    return [[[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] firstObject] URLByAppendingPathComponent:@"Emission-master.js"];
  }

- (NSURL *_Nonnull)fileURLForLatestCommitMetadata
  {
    return [[[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] firstObject] URLByAppendingPathComponent:@"master-metadata.json"];
  }


- (void)downloadMetadataForMasterCommit:(void (^_Nonnull)(NSError * _Nullable error, Metadata * _Nullable metadata))completionHandler
  {
    NSURL *url = [NSURL URLWithString:@"https://s3.amazonaws.com/artsy-emission-js/master-metadata.json"];
      NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithURL:url completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {

        if (error) { completionHandler(error, nil); return; }

        NSError *jsonError = nil;

        Metadata *metadata = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&error];
        if (error) { completionHandler(jsonError, nil); return; }

        NSURL *fileURL = [self fileURLForLatestCommitMetadata];
        [data writeToURL:fileURL atomically:YES];

        completionHandler(nil, metadata);
      }];

      [task resume];
  }

- (void)downloadJavaScriptForMasterCommit:(void (^ _Nonnull)(NSString * _Nullable title, NSString * _Nullable subtitle))metadataCallback completion:(void (^_Nonnull)(NSURL * _Nullable downloadedFileURL, NSError * _Nullable error))completionHandler;
  {
    // Get the metadata first, then grab the master commit if we get metadata correctly
    [self downloadMetadataForMasterCommit:^(NSError * _Nullable error, Metadata *metadata) {
      if (error) { completionHandler(nil, error); return; }

      NSString *title = @"Downloading JS";
      NSString *subtitle = [NSString stringWithFormat:@"Last PR: #%@ - %@", metadata.number, metadata.title];

      dispatch_async(dispatch_get_main_queue(), ^{
        metadataCallback(title, subtitle);
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
