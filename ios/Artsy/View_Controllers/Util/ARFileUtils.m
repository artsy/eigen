#import "ARLogger.h"
#import "ARFileUtils.h"
#import "User.h"

static NSString *_userDocumentsDirectory = nil;
static NSString *_cachesDirectory = nil;
static NSString *_appSupportDirectory = nil;


@implementation ARFileUtils

+ (void)initialize
{
    NSFileManager *fm = [NSFileManager defaultManager];
    _userDocumentsDirectory = [[fm URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask][0] relativePath];
    _cachesDirectory = [[fm URLsForDirectory:NSCachesDirectory inDomains:NSUserDomainMask][0] relativePath];
    _appSupportDirectory = [[fm URLsForDirectory:NSApplicationSupportDirectory inDomains:NSUserDomainMask][0] relativePath];
}

+ (NSString *)userDocumentsFolder
{
    if (![User currentUser]) return nil;
    return [_userDocumentsDirectory stringByAppendingPathComponent:[User currentUser].userID];
}

+ (NSString *)userDocumentsPathWithFile:(NSString *)filename
{
    if (![User currentUser]) return nil;
    return [self pathWithFolder:_userDocumentsDirectory folderName:[User currentUser].userID filename:filename];
}

+ (NSString *)userDocumentsPathWithFolder:(NSString *)folderName filename:(NSString *)filename
{
    if (![User currentUser]) return nil;
    folderName = [[User currentUser].userID stringByAppendingPathComponent:folderName];
    return [self pathWithFolder:_userDocumentsDirectory folderName:folderName filename:filename];
}

+ (NSString *)cachesFolder
{
    return _cachesDirectory;
}

+ (NSString *)cachesPathWithFolder:(NSString *)folderName filename:(NSString *)filename
{
    return [self pathWithFolder:_cachesDirectory folderName:folderName filename:filename];
}

+ (NSString *)appDocumentsPathWithFolder:(NSString *)folderName filename:(NSString *)filename
{
    return [self pathWithFolder:_userDocumentsDirectory folderName:folderName filename:filename];
}

+ (NSString *)appSupportFolder;
{
    return [self pathWithFolder:_appSupportDirectory folderName:[[NSBundle mainBundle] bundleIdentifier] filename:nil];
}

+ (NSString *)appSupportPathWithFolder:(NSString *)folderName filename:(NSString *)filename;
{
    if (folderName) {
        return [self pathWithFolder:self.appSupportFolder folderName:folderName filename:filename];
    } else {
        return [self.appSupportFolder stringByAppendingPathComponent:filename];
    }
}

+ (NSString *)pathWithFolder:(NSString *)rootFolderName folderName:(NSString *)folderName filename:(NSString *)filename
{
    NSString *directory = folderName ? [rootFolderName stringByAppendingPathComponent:folderName] : rootFolderName;

    if (![[NSFileManager defaultManager] fileExistsAtPath:directory isDirectory:nil]) {
        NSError *error = nil;
        [[NSFileManager defaultManager] createDirectoryAtPath:directory withIntermediateDirectories:YES attributes:nil error:&error];
        if (error) {
            ARErrorLog(@"Error creating directory at path %@/%@", rootFolderName, folderName);
            ARErrorLog(@"%@", [error userInfo]);
            return nil;
        }
    }

    return filename ? [directory stringByAppendingPathComponent:filename] : directory;
}

@end
