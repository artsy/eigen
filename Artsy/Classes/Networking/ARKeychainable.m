#import <UICKeyChainStore/UICKeyChainStore.h>

#import "ARKeychainable.h"

@implementation ARKeychain

- (void)removeKeychainStringForKey:(NSString *)key
{
    NSString *service = [UICKeyChainStore defaultService];
    NSString *appBundle = [[NSBundle mainBundle] bundleIdentifier];
    NSString *accessGroup = [@"group." stringByAppendingString:appBundle];

    [UICKeyChainStore removeItemForKey:key service:service accessGroup:accessGroup];
}

- (NSString *)keychainStringForKey:(NSString *)key
{
    NSString *service = [UICKeyChainStore defaultService];
    NSString *appBundle = [[NSBundle mainBundle] bundleIdentifier];
    NSString *accessGroup = [@"group." stringByAppendingString:appBundle];

    return [UICKeyChainStore stringForKey:key service:service accessGroup:accessGroup];
}

- (void)setKeychainStringForKey:(NSString *)key value:(NSString *)value
{
    NSString *service = [UICKeyChainStore defaultService];
    NSString *appBundle = [[NSBundle mainBundle] bundleIdentifier];
    NSString *accessGroup = [@"group." stringByAppendingString:appBundle];

    [UICKeyChainStore setString:value forKey:key service:service accessGroup:accessGroup];
}

@end

@implementation ARDictionaryBackedKeychain

- (instancetype)init
{
    self = [super init];
    if (!self) { return nil; }

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
