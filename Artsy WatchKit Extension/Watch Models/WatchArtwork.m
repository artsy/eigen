#import "WatchArtwork.h"
#import <UIKit/UIKit.h>
#import "UIFont+ArtsyFonts.h"


@implementation WatchArtwork

- (instancetype)initWithArtworkID:(NSString *)artworkID title:(NSString *)title date:(NSString *)date artistName:(NSString *)artistName thumbnailImageURL:(NSURL *)thumbnailImageURL
{
    self = [super init];
    if (!self) return nil;

    _artworkID = artworkID;
    _title = title;
    _date = date;
    _artistName = artistName;
    _thumbnailImageURL = thumbnailImageURL;

    return self;
}

- (NSDictionary *)dictionaryRepresentation
{
    return @{
        @"artworkID" : self.artworkID ?: @"",
        @"title" : self.title ?: @"",
        @"date" : self.date ?: @"",
        @"artistName" : self.artistName ?: @"",
        @"thumbnailImageURL" : self.thumbnailImageURL.absoluteString ?: @"",
    };
}

- (instancetype)initWithDictionary:(NSDictionary *)dictionary
{
    return [self initWithArtworkID:dictionary[@"artworkID"] title:dictionary[@"title"] date:dictionary[@"date"] artistName:dictionary[@"artistName"] thumbnailImageURL:[NSURL URLWithString:dictionary[@"thumbnailImageURL"]]];
}

- (NSAttributedString *)titleAndDateAttributedString
{
    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:3];

    // Why can't I use a serifItalicFont ?!

    NSString *title = self.title ?: @"Untitled";
    NSMutableAttributedString *titleAndDate = [[NSMutableAttributedString alloc] initWithString:title attributes:@{
        NSParagraphStyleAttributeName : paragraphStyle,

        NSFontAttributeName : [UIFont serifFontWithSize:16]
    }];

    if (self.date.length > 0) {
        NSString *formattedTitleDate = [@", " stringByAppendingString:self.date];
        NSAttributedString *andDate = [[NSAttributedString alloc] initWithString:formattedTitleDate attributes:@{
            NSFontAttributeName : [UIFont serifFontWithSize:16]
        }];
        [titleAndDate appendAttributedString:andDate];
    }

    return titleAndDate.copy;
}

@end
