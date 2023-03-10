// Note: these should be moved into NSFileManager categories

#import <Foundation/Foundation.h>


@interface ARFileUtils : NSObject

/// user documents
+ (NSString *)userDocumentsPathWithFile:(NSString *)filename;

/// caches
+ (NSString *)cachesPathWithFolder:(NSString *)folderName filename:(NSString *)filename;

/// App support
+ (NSString *)appSupportFolder;
+ (NSString *)appSupportPathWithFolder:(NSString *)folderName filename:(NSString *)filename;

@end
