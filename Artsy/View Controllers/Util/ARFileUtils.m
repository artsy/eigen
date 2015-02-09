#import "ARFileUtils.h"

static NSString *_userDocumentsDirectory;
static NSString *_cachesDirectory;

@implementation ARFileUtils

+ (void)initialize
{
    _userDocumentsDirectory = [[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask].lastObject relativePath];
    _cachesDirectory = [[[NSFileManager defaultManager] URLsForDirectory:NSCachesDirectory inDomains:NSUserDomainMask].lastObject relativePath];
}

+ (NSString *)userDocumentsFolder
{
    if(![User currentUser]) return nil;
    return [NSString stringWithFormat:@"%@/%@", _userDocumentsDirectory, [User currentUser].userID];
}

+ (NSString *)userDocumentsPathWithFile:(NSString *)fileName
{
    if(![User currentUser]) return nil;
    return [self pathWithFolder:_userDocumentsDirectory folderName:[User currentUser].userID filename:fileName];
}

+ (NSString *)userDocumentsPathWithFolder:(NSString *)folderName filename:(NSString *)fileName
{
    if(![User currentUser]) return nil;
    return [self pathWithFolder:_userDocumentsDirectory folderName:NSStringWithFormat(@"%@/%@", [User currentUser].userID, folderName) filename:fileName];
}

+ (NSString *)cachesFolder {
    return _cachesDirectory;
}

+ (NSString *)cachesPathWithFolder:(NSString *)folderName filename:(NSString *)fileName
{
    return [self pathWithFolder:_cachesDirectory folderName:folderName filename:fileName];
}

+ (NSString *)appDocumentsPathWithFolder:(NSString *)folderName filename:(NSString *)fileName
{
    return [self pathWithFolder:_userDocumentsDirectory folderName:folderName filename:fileName];
}


+ (NSString *)pathWithFolder:(NSString *)rootFolderName folderName:(NSString *)folderName filename:(NSString *)fileName
{
    NSString *directory = [NSString stringWithFormat:@"%@/%@", rootFolderName, folderName];

    if(![[NSFileManager defaultManager] fileExistsAtPath:directory isDirectory:nil]) {
        NSError *error = nil;
        [[NSFileManager defaultManager] createDirectoryAtPath:directory withIntermediateDirectories:YES attributes:nil error:&error];
        if(error) {
            ARErrorLog(@"Error creating directory at path %@/%@", rootFolderName, folderName);
            ARErrorLog(@"%@", [error userInfo]);
        }
    }

    return [NSString stringWithFormat:@"%@/%@", directory, fileName];
}

@end
