#import "ARUserActivity.h"
#import "ARRouter.h"
#import "ARShareableObject.h"
#import "SDWebImageManager.h"
#import "NSDate+DateRange.h"

#import "ARArtworkFavoritesNetworkModel.h"
#import "ARGeneFavoritesNetworkModel.h"
#import "ARArtistFavoritesNetworkModel.h"

#import <MMMarkdown/MMMarkdown.h>
@import CoreSpotlight;

NSString *stringByStrippingMarkdown(NSString *markdownString);

static NSString *const ARUserActivityTypeArtwork = @"net.artsy.artsy.artwork";
static NSString *const ARUserActivityTypeArtist = @"net.artsy.artsy.artist";
static NSString *const ARUserActivityTypeGene = @"net.artsy.artsy.gene";
static NSString *const ARUserActivityTypeFair = @"net.artsy.artsy.fair";
static NSString *const ARUserActivityTypeShow = @"net.artsy.artsy.show";


static dispatch_queue_t ARSearchAttributesQueue;

static void
ARSearchAttributesAddThumbnailData(CSSearchableItemAttributeSet *attributeSet,
                                   NSURL *thumbnailURL,
                                   ARSearchAttributesCompletionBlock completion)
{
    SDWebImageManager *manager = [SDWebImageManager sharedManager];
    [manager downloadImageWithURL:thumbnailURL
                          options:0
                         progress:nil
                        completed:^(UIImage *image, NSError *_, SDImageCacheType __, BOOL ____, NSURL *_____) {
        ar_dispatch_on_queue(ARSearchAttributesQueue, ^{
            if (image) {
                attributeSet.thumbnailData = UIImagePNGRepresentation(image);
            }
            completion(attributeSet);
        });
    }];
}

static NSString *
ARUniqueIdentifierForEntity(id entity)
{
    NSString *baseURL = [[ARRouter baseDesktopWebURL] absoluteString];
    if ([entity isKindOfClass:Fair.class]) {
        return [NSString stringWithFormat:@"%@/%@", baseURL, [entity fairID]];
    } else {
        return [baseURL stringByAppendingString:[entity performSelector:@selector(publicArtsyPath)]];
    }
}

static NSURL *
ARWebpageURLForEntity(id entity)
{
    return [NSURL URLWithString:ARUniqueIdentifierForEntity(entity)];
}


@implementation ARUserActivity

+ (void)load;
{
    ARSearchAttributesQueue = dispatch_queue_create("net.artsy.artsy.ARSearchAttributesQueue", DISPATCH_QUEUE_SERIAL);
}

+ (void)indexAllUsersFavorites;
{
    NSMutableArray *networkModels = [NSMutableArray new];
    [networkModels addObject:[ARArtworkFavoritesNetworkModel new]];
    [networkModels addObject:[ARArtistFavoritesNetworkModel new]];
    [networkModels addObject:[ARGeneFavoritesNetworkModel new]];

    // * Needs the __block modifier, otherwise the block would capture the initial `nil` object.
    // * Needs to be copied so it becomes a NSMallocBlock. NSStackBlock just works in debug, for some reason.
    __block dispatch_block_t fetchFavoritesBlock = nil;
    fetchFavoritesBlock = [^{
        ARFavoritesNetworkModel *networkModel = [networkModels firstObject];
        [networkModel getFavorites:^(NSArray *entities) {
            for (id entity in entities) {
                [self addEntityToSpotlightIndex:entity];
            }
            if (networkModel.allDownloaded) {
                [networkModels removeObject:networkModel];
            }
            if (networkModels.count == 0) {
                NSLog(@"Finished fetching all favorites.");
                // Release block.
                fetchFavoritesBlock = nil;
            } else {
                // Recursively call block.
                ar_dispatch_on_queue(ARSearchAttributesQueue, fetchFavoritesBlock);
            }
        }
                                    failure:^(NSError *error) {
            NSLog(@"Failed to fetch favorites, cancelling: %@", error);
            // Release block.
            fetchFavoritesBlock = nil;
        }];
    } copy];

    // Kick-off
    ar_dispatch_on_queue(ARSearchAttributesQueue, fetchFavoritesBlock);
}

#pragma mark - CSSearchableIndex

+ (void)addToSpotlightIndex:(BOOL)addOrRemove entity:(id)entity;
{
    addOrRemove ? [self addEntityToSpotlightIndex:entity] : [self removeEntityFromSpotlightIndex:entity];
}

+ (void)addEntityToSpotlightIndex:(id)entity;
{
    [self searchAttributesWithEntity:entity completion:^(CSSearchableItemAttributeSet *attributeSet) {
        NSString *domainIdentifier = nil;
        if ([entity isKindOfClass:Artwork.class]) {
            domainIdentifier = ARUserActivityTypeArtwork;
        } else if ([entity isKindOfClass:Artist.class]) {
            domainIdentifier = ARUserActivityTypeArtist;
        } else if ([entity isKindOfClass:Gene.class]) {
            domainIdentifier = ARUserActivityTypeGene;
        }
        NSString *identifier = attributeSet.relatedUniqueIdentifier;
        CSSearchableItem *item = [[CSSearchableItem alloc] initWithUniqueIdentifier:identifier
                                                                   domainIdentifier:domainIdentifier
                                                                       attributeSet:attributeSet];
        [[CSSearchableIndex defaultSearchableIndex] indexSearchableItems:@[item] completionHandler:^(NSError *error) {
            if (error) {
                NSLog(@"Failed to index entity `%@': %@", identifier, error);
            } else {
                NSLog(@"Indexed entity `%@'", identifier);
            }
        }];
    }];
}

+ (void)removeEntityFromSpotlightIndex:(id)entity;
{
    ar_dispatch_on_queue(ARSearchAttributesQueue, ^{
        NSString *identifier = ARUniqueIdentifierForEntity(entity);
        [[CSSearchableIndex defaultSearchableIndex] deleteSearchableItemsWithIdentifiers:@[identifier]
                                                                       completionHandler:^(NSError *error) {
            if (error) {
                NSLog(@"Failed to remove `%@' from index: %@", identifier, error);
            } else {
                NSLog(@"Removed from index: %@", identifier);
            }
        }];
    });
}

#pragma mark - CSSearchableItemAttributeSet

// Only the entities that don’t require a second model to build the search attributes are currently supported.
// This excludes Fair and Show models.
+ (void)searchAttributesWithEntity:(id)entity completion:(ARSearchAttributesCompletionBlock)completion;
{
    if ([entity isKindOfClass:Artwork.class]) {
        [self searchAttributesWithArtwork:entity completion:completion];
    } else if ([entity isKindOfClass:Artist.class]) {
        [self searchAttributesWithArtist:entity completion:completion];
    } else if ([entity isKindOfClass:Gene.class]) {
        [self searchAttributesWithGene:entity completion:completion];
    } else {
        NSAssert(NO, @"Unsupported entity type: %@", entity);
    }
}

+ (void)searchAttributesWithArtwork:(Artwork *)artwork completion:(ARSearchAttributesCompletionBlock)completion;
{
    ar_dispatch_on_queue(ARSearchAttributesQueue, ^{
        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(artwork);
        attributeSet.title = artwork.title;

        if (artwork.date.length > 0) {
            attributeSet.contentDescription = [NSString stringWithFormat:@"%@, %@\n%@", artwork.artist.name, artwork.date, artwork.medium];
        } else {
            attributeSet.contentDescription = [NSString stringWithFormat:@"%@\n%@", artwork.artist.name, artwork.medium];
        }

        ARSearchAttributesAddThumbnailData(attributeSet, artwork.defaultImage.urlForThumbnailImage, completion);
    });
}

+ (void)searchAttributesWithArtist:(Artist *)artist completion:(ARSearchAttributesCompletionBlock)completion;
{
    ar_dispatch_on_queue(ARSearchAttributesQueue, ^{
        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(artist);
        attributeSet.title = artist.name;

        if (artist.blurb.length > 0) {
            attributeSet.contentDescription = stringByStrippingMarkdown(artist.blurb);
        } else {
            attributeSet.contentDescription = artist.birthday;
        }

        ARSearchAttributesAddThumbnailData(attributeSet, artist.squareImageURL, completion);
    });
}

+ (void)searchAttributesWithGene:(Gene *)gene completion:(ARSearchAttributesCompletionBlock)completion;
{
    ar_dispatch_on_queue(ARSearchAttributesQueue, ^{
        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(gene);
        attributeSet.title = gene.name;

        if (gene.geneDescription.length > 0) {
            attributeSet.contentDescription = stringByStrippingMarkdown(gene.geneDescription);
        } else {
            attributeSet.contentDescription = @"Category on Artsy";
        }

        ARSearchAttributesAddThumbnailData(attributeSet, gene.smallImageURL, completion);
    });
}

+ (void)searchAttributesWithFair:(Fair *)fair withProfile:(Profile *)fairProfile completion:(ARSearchAttributesCompletionBlock)completion;
{
    ar_dispatch_on_queue(ARSearchAttributesQueue, ^{
        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(fair);
        attributeSet.title = fair.name;
        attributeSet.startDate = fair.startDate;
        attributeSet.endDate = fair.endDate;

        if (fair.location) {
            attributeSet.contentDescription = fair.location;
        } else {
            attributeSet.contentDescription = @"Art fair on Artsy";
        }

        if (fairProfile) {
            ARSearchAttributesAddThumbnailData(attributeSet, [NSURL URLWithString:fairProfile.iconURL], completion);
        } else {
            completion(attributeSet);
        }
    });
}

+ (void)searchAttributesWithShow:(PartnerShow *)show inFair:(Fair *)fair completion:(ARSearchAttributesCompletionBlock)completion;
{
    ar_dispatch_on_queue(ARSearchAttributesQueue, ^{
        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(show);
        attributeSet.title = show.name;

        NSString *location;
        if (fair && fair.location) {
            location = fair.location;
        } else {
            location = [NSString stringWithFormat:@"%@, %@ %@", show.location.city, show.location.state, show.location.country];
        }
        NSString *dates = [show.startDate ausstellungsdauerToDate:show.endDate];
        attributeSet.contentDescription = [NSString stringWithFormat:@"%@\n%@\n%@", show.partner.name, location, dates];
        attributeSet.startDate = show.startDate;
        attributeSet.endDate = show.endDate;

        ARSearchAttributesAddThumbnailData(attributeSet, show.smallPreviewImageURL, completion);
    });
}

#pragma mark - ARUserActivity

+ (instancetype)activityWithArtwork:(Artwork *)artwork becomeCurrent:(BOOL)becomeCurrent;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeArtwork];
    activity.title = artwork.name;
    activity.webpageURL = ARWebpageURLForEntity(artwork);
    activity.userInfo = @{@"id" : artwork.artworkID};

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        [self searchAttributesWithArtwork:artwork completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity setContentAttributeSet:attributeSet becomeCurrent:becomeCurrent];
        }];
    } else {
        if (becomeCurrent) [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithArtist:(Artist *)artist becomeCurrent:(BOOL)becomeCurrent;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeArtist];
    activity.title = artist.name;
    activity.webpageURL = ARWebpageURLForEntity(artist);
    activity.userInfo = @{@"id" : artist.artistID};

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        [self searchAttributesWithArtist:artist completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity setContentAttributeSet:attributeSet becomeCurrent:becomeCurrent];
        }];
    } else {
        if (becomeCurrent) [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithGene:(Gene *)gene becomeCurrent:(BOOL)becomeCurrent;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeGene];
    activity.title = gene.name;
    activity.webpageURL = ARWebpageURLForEntity(gene);
    activity.userInfo = @{@"id" : gene.geneID};

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        [self searchAttributesWithGene:gene completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity setContentAttributeSet:attributeSet becomeCurrent:becomeCurrent];
        }];
    } else {
        if (becomeCurrent) [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithFair:(Fair *)fair withProfile:(Profile *)fairProfile becomeCurrent:(BOOL)becomeCurrent;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeFair];
    activity.title = fair.name;
    activity.webpageURL = ARWebpageURLForEntity(fair);
    activity.userInfo = @{@"id" : fair.fairID};

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        [self searchAttributesWithFair:fair withProfile:fairProfile completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity setContentAttributeSet:attributeSet becomeCurrent:becomeCurrent];
        }];
    } else {
        if (becomeCurrent) [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithShow:(PartnerShow *)show inFair:(Fair *)fair becomeCurrent:(BOOL)becomeCurrent;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeShow];
    activity.title = show.name;
    activity.webpageURL = ARWebpageURLForEntity(show);
    activity.userInfo = @{@"id" : show.showID};

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        [self searchAttributesWithShow:show inFair:fair completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity setContentAttributeSet:attributeSet becomeCurrent:becomeCurrent];
        }];
    } else {
        if (becomeCurrent) [activity becomeCurrent];
    }

    return activity;
}

- (void)setContentAttributeSet:(CSSearchableItemAttributeSet *)attributeSet becomeCurrent:(BOOL)becomeCurrent;
{
    // First modify the attributeSet on the dedicated queue.
    // This needs to be done because of: https://forums.developer.apple.com/message/28220#28220
    //
    // TODO Test if this is still an issue in the iOS 9 GM and, if so, add a unit test.
    attributeSet.relatedUniqueIdentifier = nil;

    // Then ensure that this work is only performed from the main thread.
    ar_dispatch_main_queue(^{
        self.contentAttributeSet = attributeSet;
        if (becomeCurrent) {
            [self becomeCurrent];
        }
    });
}

+ (BOOL)isSpotlightIndexingAvailable
{
    return [NSUserActivity instancesRespondToSelector:@selector(isEligibleForSearch)];
}

NSString *stringByStrippingMarkdown(NSString *markdownString)
{
    NSError *error = nil;
    NSString *renderedString = [MMMarkdown HTMLStringWithMarkdown:markdownString error:&error];
    NSDictionary *importParams = @{NSDocumentTypeDocumentAttribute : NSHTMLTextDocumentType};
    NSData *stringData = [renderedString dataUsingEncoding:NSUnicodeStringEncoding];
    NSAttributedString *attributedString = [[NSAttributedString alloc] initWithData:stringData options:importParams documentAttributes:NULL error:&error];
    if (error) {
        return nil;
    }

    return attributedString.string;
}

@end
