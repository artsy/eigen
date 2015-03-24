#import <WatchKit/WatchKit.h>
#import <Foundation/Foundation.h>

@interface ARWatchShowViewController : WKInterfaceController
@property (strong, nonatomic) IBOutlet WKInterfaceImage *thumbnail;

@property (strong, nonatomic) IBOutlet WKInterfaceLabel *galleryName;
@property (strong, nonatomic) IBOutlet WKInterfaceLabel *showTitle;
@property (strong, nonatomic) IBOutlet WKInterfaceLabel *showAusstellungsdauer;
@property (strong, nonatomic) IBOutlet WKInterfaceLabel *showLocation;

@property (strong, nonatomic) IBOutlet WKInterfaceMap *mapPreview;
@end
