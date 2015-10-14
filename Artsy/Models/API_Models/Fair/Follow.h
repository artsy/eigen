#import <Mantle/Mantle.h>

@class Artist, Profile;


@interface Follow : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *followID;
@property (nonatomic, copy, readonly) Artist *artist;
@property (nonatomic, copy, readonly) Profile *profile;

@end
