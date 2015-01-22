#import "ARSharingController.h"
#import "ARURLItemProvider.h"
#import "ARMessageItemProvider.h"
#import "ARImageItemProvider.h"

@interface ARSharingController (Testing)
- (NSString *)message;
- (NSString *)objectID;
- (NSArray *)activityItems;
@property (nonatomic, strong) id <ARShareableObject> object;
@property (nonatomic, strong) ARURLItemProvider *urlProvider;
@property (nonatomic, strong) ARImageItemProvider *imageProvider;
@property (nonatomic, strong) ARMessageItemProvider *messageProvider;
- (void)shareWithThumbnailImageURL:(NSURL *)thumbnailImageURL image:(UIImage *)image;
- (instancetype)initWithObject:(id)object;
- (void)presentActivityViewController;
@end

SpecBegin(ARSharingController)

describe(@"sharing", ^{
    __block ARSharingController *sharingController;
    
    describe(@"objectID", ^{
        before(^{
            sharingController = [ARSharingController new];
        });
        
        for (Class class in @[[Artwork class], [Artist class], [Gene class], [PartnerShow class]]){
            it([NSString stringWithFormat:@"returns %@ id", class], ^{
                NSString *object_id = NSStringWithFormat(@"id_for_%@", NSStringFromClass(class));
                sharingController.object = [class modelWithJSON:@{@"id" : object_id} error:nil];
                expect(sharingController.objectID).to.equal(object_id);
            });
        };
    });

    describe(@"message", ^{
        before(^{
            sharingController = [ARSharingController new];
        });

        describe(@"with an Artwork", ^{
            __block Artwork *artwork;
            before(^{
                artwork = [Artwork modelWithJSON:@{@"title" : @"Artwork Title"}];
                sharingController.object = artwork;
            });
            it(@"formats string when there is no Artist", ^{
                expect([sharingController message]).to.equal(@"\"Artwork Title\"");
            });
            it(@"formats string when there is an Artist", ^{
                Artist *artist = [Artist modelWithJSON:@{@"name" : @"An Artist"}];
                artwork.artist = artist;
                expect([sharingController message]).to.equal(@"\"Artwork Title\" by An Artist");
            });
        });

        it(@"formats the string for a PartnerShow", ^{
            PartnerShow *show = [PartnerShow modelWithJSON:@{@"name" : @"The Best Show Ever"}];
            sharingController.object = show;
            expect([sharingController message]).to.equal(@"See The Best Show Ever");
        });


        it(@"returns a Gene's name", ^{
            Gene *gene = [Gene modelWithJSON:@{@"name" : @"Surrealism"}];
            sharingController.object = gene;
            expect([sharingController message]).to.equal(@"Surrealism");
        });

        it(@"returns an Artist's name", ^{
            Artist *artist = [Artist modelWithJSON:@{@"name" : @"Jeff Koons"}];
            sharingController.object = artist;
            expect([sharingController message]).to.equal(@"Jeff Koons");
        });
    });

    describe(@"activityItems", ^{
        __block ARMessageItemProvider *messageProvider;
        __block ARURLItemProvider *urlProvider;

        before(^{
            sharingController = [ARSharingController new];
            messageProvider = [ARMessageItemProvider new];
            urlProvider = [ARURLItemProvider new];
        });

        it(@"orders items", ^{
            [sharingController shareWithThumbnailImageURL:nil image:nil];
            NSArray *activityItems = [sharingController activityItems];
            expect([activityItems count]).to.equal(3);
            expect(activityItems[0]).to.beKindOf([ARMessageItemProvider class]);
            expect(activityItems[1]).to.beKindOf([ARURLItemProvider class]);
            expect(activityItems[2]).to.beKindOf([ARImageItemProvider class]);
        });
    });

    describe(@"initWithObject", ^{
        it(@"sets object", ^{
            Artist *artistObject = [Artist new];
            sharingController = [[ARSharingController alloc] initWithObject:artistObject];
            expect(sharingController.object).to.equal(artistObject);
        });
    });

    describe(@"sharewithImage", ^{
        before(^{
            sharingController = [ARSharingController new];
        });

        it(@"sets all providers", ^{
            [sharingController shareWithThumbnailImageURL:nil image:nil];
            expect(sharingController.messageProvider).notTo.beNil();
            expect(sharingController.urlProvider).notTo.beNil();
            expect(sharingController.imageProvider).notTo.beNil();
        });

        it(@"triggers the View Controller", ^{
            id mock = [OCMockObject partialMockForObject:sharingController];
            [[mock expect] presentActivityViewController];
            [sharingController shareWithThumbnailImageURL:nil image:nil];
            [mock verify];
        });
    });
});

SpecEnd
