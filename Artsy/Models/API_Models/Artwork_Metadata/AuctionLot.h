#import <Mantle/Mantle.h>


@interface AuctionLot : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy) NSString *auctionLotID;
@property (nonatomic, copy) NSString *dimensionsCM;
@property (nonatomic, copy) NSString *dimensionsInches;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *estimate;
@property (nonatomic, copy) NSString *price;
@property (nonatomic, copy) NSString *dates;
@property (nonatomic, copy) NSString *auctionDateText;
@property (nonatomic, copy) NSString *organization;
@property (nonatomic, copy) NSDictionary *imageURLs;

@property (nonatomic, copy) NSURL *externalURL;
@property (nonatomic, strong) NSDate *auctionDate;

- (NSURL *)imageURL;
@end
