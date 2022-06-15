// Note: these should be moved into NSFileManager categories

#import <Foundation/Foundation.h>


@interface ARFileUtils : NSObject

/// user documents

+ (NSString *)userDocumentsFolder;

+ (NSString *)userDocumentsPathWithFile:(NSString *)filename;

+ (NSString *)userDocumentsPathWithFolder:(NSString *)folderName filename:(NSString *)filename;

/// caches

+ (NSString *)cachesFolder;

+ (NSString *)cachesPathWithFolder:(NSString *)folderName filename:(NSString *)filename;

/// App documents
+ (NSString *)appDocumentsPathWithFolder:(NSString *)folderName filename:(NSString *)filename;

/// App support
+ (NSString *)appSupportFolder;
+ (NSString *)appSupportPathWithFolder:(NSString *)folderName filename:(NSString *)filename;

@end
