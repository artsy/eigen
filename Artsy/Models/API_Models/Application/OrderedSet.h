#import <Mantle/Mantle.h>


@interface OrderedSet : MTLModel <MTLJSONSerializing>

@property (readonly, nonatomic, copy) NSString *orderedSetID;

@property (readonly, nonatomic, copy) NSString *key;
@property (readonly, nonatomic, copy) NSString *name;
@property (readonly, nonatomic, copy) NSString *orderedSetDescription;
@property (readonly, nonatomic, copy) NSString *itemType;

- (void)getItems:(void (^)(NSArray *items))success;

// TODO: owner

@end
