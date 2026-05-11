@interface ARStandardDateFormatter : NSISO8601DateFormatter

/// Shared date formatter for ISO8601 text to NSDates
+ (ARStandardDateFormatter *)sharedFormatter;

/// Transforms strings from JSON to NSDates using the ISO8601 format
@property (nonatomic, readonly) NSValueTransformer *stringTransformer;

@end
