#import <Foundation/Foundation.h>


@interface WatchArtwork : NSObject

- (instancetype)initWithArtworkID:(NSString *)artworkID title:(NSString *)title date:(NSString *)date artistName:(NSString *)artistName thumbnailImageURL:(NSURL *)thumbnailImageURL;

- (NSDictionary *)dictionaryRepresentation;
- (instancetype)initWithDictionary:(NSDictionary *)dictionary;

- (NSAttributedString *)titleAndDateAttributedString;

@property (nonatomic, copy, readonly) NSString *artworkID;
@property (nonatomic, copy, readonly) NSURL *thumbnailImageURL;
@property (nonatomic, copy, readonly) NSString *title;
@property (nonatomic, copy, readonly) NSString *date;
@property (nonatomic, copy, readonly) NSString *artistName;

@end
