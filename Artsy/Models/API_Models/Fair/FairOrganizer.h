#import <Mantle/Mantle.h>


@interface FairOrganizer : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *fairOrganizerID;
@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *profileID;
@property (nonatomic, copy, readonly) NSString *defaultFairID;

@end
