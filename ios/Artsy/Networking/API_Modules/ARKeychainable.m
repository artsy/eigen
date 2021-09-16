#import <UICKeyChainStore/UICKeyChainStore.h>
#import "ARDefaults.h"
#import "AROptions.h"
#import "ARKeychainable.h"
#import <AREmission.h>


@implementation ARKeychain

- (NSString *)accessGroup;
{
    NSDictionary *info = [[NSBundle mainBundle] infoDictionary];
    return [NSString stringWithFormat:@"%@%@.keychain-group", info[@"AppIdentifierPrefix"], info[@"CFBundleIdentifier"]];
}

- (NSString *)keyForEnvironment:(NSString *)key
{
    BOOL useStaging = [[AREmission sharedInstance] isStaging];
    // For prod, keep backawards compatabilty by re-using existing key
    if (!useStaging) {
        return key;
    }
    // For staging use a postfixed key so they cannot share with
    // production data at all.
    return [key stringByAppendingString:@"-staging"];
}

- (void)removeKeychainStringForKey:(NSString *)key
{
    NSString *service = [UICKeyChainStore defaultService];
    [UICKeyChainStore removeItemForKey:key service:service accessGroup:self.accessGroup];
}

- (NSString *)keychainStringForKey:(NSString *)key
{
    NSString *service = [UICKeyChainStore defaultService];
    return [UICKeyChainStore stringForKey:key service:service accessGroup:self.accessGroup];
}

- (void)setKeychainStringForKey:(NSString *)key value:(NSString *)value
{
    NSString *service = [UICKeyChainStore defaultService];
    [UICKeyChainStore setString:value forKey:key service:service accessGroup:self.accessGroup];
}

@end


@implementation ARDictionaryBackedKeychain

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _dict = [NSMutableDictionary dictionary];
    return self;
}

- (NSString *)keychainStringForKey:(NSString *)key
{
    return self.dict[key];
}

- (void)removeKeychainStringForKey:(NSString *)key
{
    [self.dict removeObjectForKey:key];
}

- (void)setKeychainStringForKey:(NSString *)key value:(NSString *)value
{
    [self.dict setObject:value forKey:key];
}

@end
