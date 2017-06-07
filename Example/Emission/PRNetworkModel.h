#import <Foundation/Foundation.h>

@interface PRNetworkModel : NSObject

- (void)getPRs:(void (^_Nonnull)(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error))completionHandler;

- (void)verifyJSAtPRNumber:(NSUInteger)number completion:(void (^_Nonnull)(BOOL exists))completionHandler;

- (NSURL *_Nonnull)fileURLForPRJavaScript;

- (void)downloadJavaScriptForPRNumber:(NSUInteger)number completion:(void (^_Nonnull)(NSURL * _Nullable downloadedFileURL, NSError * _Nullable error))completionHandler;

@end
