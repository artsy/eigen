#import <ISO8601DateFormatter/ISO8601DateFormatter.h>


@interface ARStandardDateFormatter : ISO8601DateFormatter

/// Shared date formatter for ISO8601 text to NSDates
+ (ARStandardDateFormatter *)sharedFormatter;

/// Transforms strings from JSON to NSDates using the ISO8601 format
@property (nonatomic, readonly) NSValueTransformer *stringTransformer;

@end
