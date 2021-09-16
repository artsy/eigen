/// A protocol that sets/edits strings in the keychain

@protocol ARKeychainable <NSObject>

- (void)removeKeychainStringForKey:(NSString *)key;
- (NSString *)keychainStringForKey:(NSString *)key;
- (void)setKeychainStringForKey:(NSString *)key value:(NSString *)value;

@end

/// Provides an API for the Keychain with correct access groups
@interface ARKeychain : NSObject <ARKeychainable>
@end

/// Provides a stubbed API that is easily inspected
@interface ARDictionaryBackedKeychain : NSObject <ARKeychainable>
@property (nonatomic, strong) NSMutableDictionary *dict;
@end
