#import <Foundation/Foundation.h>

@interface CommitNetworkModel : NSObject

- (NSURL *_Nonnull)fileURLForLatestCommitJavaScript;

  // First passes some metadata back, before downloading the larger JS for emission from master
- (void)downloadJavaScriptForMasterCommit:(void (^ _Nonnull)(NSString * _Nullable title, NSString * _Nullable subtitle))metadata completion:(void (^_Nonnull)(NSURL * _Nullable downloadedFileURL, NSError * _Nullable error))completionHandler;

  @end
