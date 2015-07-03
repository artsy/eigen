// Note: these should be moved into NSFileManager categories


@interface ARFileUtils : NSObject

/// user documents

+ (NSString *)userDocumentsFolder;

+ (NSString *)userDocumentsPathWithFile:(NSString *)fileName;

+ (NSString *)userDocumentsPathWithFolder:(NSString *)folderName filename:(NSString *)fileName;

/// caches

+ (NSString *)cachesFolder;

+ (NSString *)cachesPathWithFolder:(NSString *)folderName filename:(NSString *)fileName;

/// App documents
+ (NSString *)appDocumentsPathWithFolder:(NSString *)folderName filename:(NSString *)fileName;

@end
