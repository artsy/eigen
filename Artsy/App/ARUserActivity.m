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

static NSString *const ARUserActivityTypeArtwork = @"net.artsy.artsy.artwork";
static NSString *const ARUserActivityTypeArtist = @"net.artsy.artsy.artist";
static NSString *const ARUserActivityTypeGene = @"net.artsy.artsy.gene";
static NSString *const ARUserActivityTypeFair = @"net.artsy.artsy.fair";
static NSString *const ARUserActivityTypeShow = @"net.artsy.artsy.show";

static BOOL ARSpotlightAvailable = NO;

static dispatch_queue_t ARUserActivityQueue = nil;
static NSMutableSet *ARIndexedEntities = nil;
static NSString *ARIndexedEntitiesFile = nil;
static CSSearchableIndex *ARSearchableIndex = nil;


static NSString *
ARStringByStrippingMarkdown(NSString *markdownString)
{
    NSError *error = nil;
    NSString *renderedString = [MMMarkdown HTMLStringWithMarkdown:markdownString error:&error];
    NSDictionary *importParams = @{NSDocumentTypeDocumentAttribute : NSHTMLTextDocumentType};
    NSData *stringData = [renderedString dataUsingEncoding:NSUnicodeStringEncoding];
    NSAttributedString *attributedString = [[NSAttributedString alloc] initWithData:stringData
                                                                            options:importParams
                                                                 documentAttributes:NULL
                                                                              error:&error];
    if (error) {
        return nil;
    }

    return [attributedString.string stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
}


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
        ar_dispatch_on_queue(ARUserActivityQueue, ^{
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
    ARSpotlightAvailable = NSClassFromString(@"CSSearchableIndex") != nil && [CSSearchableIndex isIndexingAvailable];

    if (ARSpotlightAvailable) {
        ARSearchableIndex = [CSSearchableIndex defaultSearchableIndex];

        ARUserActivityQueue = dispatch_queue_create("net.artsy.artsy.ARUserActivityQueue", DISPATCH_QUEUE_SERIAL);

        // Load/Initialize ARIndexedEntities db.
        ar_dispatch_on_queue(ARUserActivityQueue, ^{
            NSString *appSupportDir = [NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory,
                                                                           NSUserDomainMask,
                                                                           YES) firstObject];
            appSupportDir = [appSupportDir stringByAppendingPathComponent:[[NSBundle mainBundle] bundleIdentifier]];
            NSError *error = nil;
            if ([[NSFileManager defaultManager] createDirectoryAtPath:appSupportDir
                                          withIntermediateDirectories:YES
                                                           attributes:nil
                                                                error:&error]) {
                ARIndexedEntitiesFile = [appSupportDir stringByAppendingPathComponent:@"ARIndexedEntitiesFile"];
                NSArray *entities = [NSArray arrayWithContentsOfFile:ARIndexedEntitiesFile];
                ARIndexedEntities = entities ? [NSMutableSet setWithArray:entities] : [NSMutableSet new];
            } else {
                ARErrorLog(@"Failed to create app support directory, will not store indexed entities: %@", error);
                ARIndexedEntitiesFile = nil;
                ARIndexedEntities = nil;
            }
        });
    }
}

+ (void)disableIndexing;
{
    dispatch_sync(ARUserActivityQueue, ^{
        ARSearchableIndex = nil;
        ARIndexedEntities = nil;
        ARIndexedEntitiesFile = nil;
    });
}

+ (CSSearchableIndex *)searchableIndex;
{
    return ARSearchableIndex;
}

+ (NSMutableSet *)indexedEntities;
{
    return ARIndexedEntities;
}

+ (void)indexAllUsersFavorites;
{
    if (!ARSpotlightAvailable) {
        return;
    }

    NSMutableArray *networkModels = [NSMutableArray new];
    [networkModels addObject:[ARArtworkFavoritesNetworkModel new]];
    [networkModels addObject:[ARArtistFavoritesNetworkModel new]];
    [networkModels addObject:[ARGeneFavoritesNetworkModel new]];

    // Remove entities from this list that are still favorites, by the end that leaves a list of entities that need to
    // be purged from the local index.
    NSMutableSet *previouslyIndexed = [self.indexedEntities mutableCopy];

    UIApplication *application = [UIApplication sharedApplication];
    __block UIBackgroundTaskIdentifier backgroundTask = UIBackgroundTaskInvalid;

    dispatch_block_t finalizeBlock = ^{
#ifdef DEBUG
        if (application.applicationState == UIApplicationStateBackground) {
            NSLog(@"Remaining allowed background time by task finalizing: %f", application.backgroundTimeRemaining);
        }
#endif
        [application endBackgroundTask:backgroundTask];
        backgroundTask = UIBackgroundTaskInvalid;
    };
    backgroundTask = [application beginBackgroundTaskWithExpirationHandler:finalizeBlock];

    // Kick-off
    ar_dispatch_on_queue(ARUserActivityQueue, ^{
        [self indexFavoritesPass:networkModels
               previouslyIndexed:previouslyIndexed
                   finalizeBlock:finalizeBlock];
    });
}

+ (void)indexFavoritesPass:(NSMutableArray *)networkModels
         previouslyIndexed:(NSMutableSet *)previouslyIndexed
             finalizeBlock:(dispatch_block_t)finalizeBlock;
{
    ARFavoritesNetworkModel *networkModel = [networkModels firstObject];
    [networkModel getFavorites:^(NSArray *entities) {
        ar_dispatch_on_queue(ARUserActivityQueue, ^{
            for (id entity in entities) {
                [self addEntityToSpotlightIndex:entity];
                [previouslyIndexed removeObject:ARUniqueIdentifierForEntity(entity)];
            }
            if (networkModel.allDownloaded) {
                [networkModels removeObject:networkModel];
            }
            if (networkModels.count == 0) {
                ARActionLog(@"Finished fetching all favorites.");
                if (previouslyIndexed.count > 0) {
                    for (NSString *identifier in previouslyIndexed.allObjects) {
                        [self removeEntityByIdentifierFromSpotlightIndex:identifier];
                    }
                }
                finalizeBlock();
            } else {
                // Recursively call
                ar_dispatch_on_queue(ARUserActivityQueue, ^{
                    [self indexFavoritesPass:networkModels
                           previouslyIndexed:previouslyIndexed
                               finalizeBlock:finalizeBlock];
                });
            }
        });
    }
                       failure:^(NSError *error) {
        ARErrorLog(@"Failed to fetch favorites, cancelling: %@", error);
        finalizeBlock();
    }];
}

#pragma mark - CSSearchableIndex

+ (void)addToSpotlightIndex:(BOOL)addOrRemove entity:(id)entity;
{
    if (!ARSpotlightAvailable) {
        return;
    }
    addOrRemove ? [self addEntityToSpotlightIndex:entity] : [self removeEntityFromSpotlightIndex:entity];
}

+ (void)addEntityToSpotlightIndex:(id)entity;
{
    ar_dispatch_on_queue(ARUserActivityQueue, ^{
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
            [self.searchableIndex indexSearchableItems:@[item] completionHandler:^(NSError *error) {
                if (error) {
                    ARErrorLog(@"Failed to index entity `%@': %@", identifier, error);
                } else {
                    ar_dispatch_on_queue(ARUserActivityQueue, ^{
                        [self.indexedEntities addObject:identifier];
                        [self.indexedEntities.allObjects writeToFile:ARIndexedEntitiesFile atomically:YES];
                        ARActionLog(@"Indexed entity `%@'", identifier);
                    });
                }
            }];
        }];
    });
}

// Only the entities that don’t require a second model to build the search attributes are currently supported.
// This excludes Fair and Show models.
+ (void)searchAttributesWithEntity:(id)entity completion:(ARSearchAttributesCompletionBlock)completion;
{
    if ([entity isKindOfClass:Artwork.class]) {
        [self searchAttributesWithArtwork:entity includeIdentifier:YES completion:completion];
    } else if ([entity isKindOfClass:Artist.class]) {
        [self searchAttributesWithArtist:entity includeIdentifier: YES completion:completion];
    } else if ([entity isKindOfClass:Gene.class]) {
        [self searchAttributesWithGene:entity includeIdentifier:YES completion:completion];
    } else {
        NSAssert(NO, @"Unsupported entity type: %@", entity);
    }
}

+ (void)removeEntityFromSpotlightIndex:(id)entity;
{
    ar_dispatch_on_queue(ARUserActivityQueue, ^{
        NSString *identifier = ARUniqueIdentifierForEntity(entity);
        [self removeEntityByIdentifierFromSpotlightIndex:identifier];
    });
}

+ (void)removeEntityByIdentifierFromSpotlightIndex:(NSString *)identifier;
{
    ar_dispatch_on_queue(ARUserActivityQueue, ^{
        [self.searchableIndex deleteSearchableItemsWithIdentifiers:@[identifier]
                                              completionHandler:^(NSError *error) {
            if (error) {
                ARErrorLog(@"Failed to remove `%@' from index: %@", identifier, error);
            } else {
                ar_dispatch_on_queue(ARUserActivityQueue, ^{
                    [self.indexedEntities removeObject:identifier];
                    [self.indexedEntities.allObjects writeToFile:ARIndexedEntitiesFile atomically:YES];
                    ARActionLog(@"Removed from index: %@", identifier);
                });
            }
        }];
    });
}

#pragma mark - CSSearchableItemAttributeSet

//
// Do NOT modify any of the returned CSSearchableItemAttributeSet objects on another queue than ARUserActivityQueue.
//

+ (CSSearchableItemAttributeSet *)searchAttributesWithArtwork:(Artwork *)artwork
                                            includeIdentifier:(BOOL)includeIdentifier
                                                   completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    if (includeIdentifier) attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(artwork);
    attributeSet.title = artwork.title;

    if (artwork.date.length > 0) {
        attributeSet.contentDescription = [NSString stringWithFormat:@"%@, %@\n%@", artwork.artist.name, artwork.date, artwork.medium];
    } else {
        attributeSet.contentDescription = [NSString stringWithFormat:@"%@\n%@", artwork.artist.name, artwork.medium];
    }

    ARSearchAttributesAddThumbnailData(attributeSet, artwork.defaultImage.urlForThumbnailImage, completion);

    return attributeSet;
}

+ (CSSearchableItemAttributeSet *)searchAttributesWithArtist:(Artist *)artist
                                           includeIdentifier:(BOOL)includeIdentifier
                                                  completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    if (includeIdentifier) attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(artist);
    attributeSet.title = artist.name;

    if (artist.blurb.length > 0) {
        attributeSet.contentDescription = ARStringByStrippingMarkdown(artist.blurb);
    } else {
        attributeSet.contentDescription = artist.birthday;
    }

    ARSearchAttributesAddThumbnailData(attributeSet, artist.squareImageURL, completion);

    return attributeSet;
}

+ (CSSearchableItemAttributeSet *)searchAttributesWithGene:(Gene *)gene
                                         includeIdentifier:(BOOL)includeIdentifier
                                                completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    if (includeIdentifier) attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(gene);
    attributeSet.title = gene.name;

    if (gene.geneDescription.length > 0) {
        attributeSet.contentDescription = ARStringByStrippingMarkdown(gene.geneDescription);
    } else {
        attributeSet.contentDescription = @"Category on Artsy";
    }

    ARSearchAttributesAddThumbnailData(attributeSet, gene.smallImageURL, completion);

    return attributeSet;
}

+ (CSSearchableItemAttributeSet *)searchAttributesWithFair:(Fair *)fair
                                               withProfile:(Profile *)fairProfile
                                         includeIdentifier:(BOOL)includeIdentifier
                                                completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    if (includeIdentifier) attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(fair);
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

    return attributeSet;
}

+ (CSSearchableItemAttributeSet *)searchAttributesWithShow:(PartnerShow *)show
                                                    inFair:(Fair *)fair
                                         includeIdentifier:(BOOL)includeIdentifier
                                                completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    if (includeIdentifier) attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(show);
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

    return attributeSet;
}

#pragma mark - ARUserActivity

// Do NOT assign a relatedUniqueIdentifier to the attribute set when combining with a user activity.
// This needs to be done because of: https://forums.developer.apple.com/message/28220#28220
//
// TODO Test if this is still an issue in the iOS 9 GM and, if so, add a unit test.

+ (instancetype)activityWithArtwork:(Artwork *)artwork becomeCurrent:(BOOL)becomeCurrent;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeArtwork];
    activity.title = artwork.name;
    activity.webpageURL = ARWebpageURLForEntity(artwork);
    activity.userInfo = @{@"id" : artwork.artworkID};

    if (ARSpotlightAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        activity.contentAttributeSet = [self searchAttributesWithArtwork:artwork
                                                       includeIdentifier:NO
                                                              completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity updateContentAttributeSet:attributeSet];
        }];
    }

    if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithArtist:(Artist *)artist becomeCurrent:(BOOL)becomeCurrent;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeArtist];
    activity.title = artist.name;
    activity.webpageURL = ARWebpageURLForEntity(artist);
    activity.userInfo = @{@"id" : artist.artistID};

    if (ARSpotlightAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        activity.contentAttributeSet = [self searchAttributesWithArtist:artist
                                                      includeIdentifier:NO
                                                              completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity updateContentAttributeSet:attributeSet];
        }];
    }

    if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithGene:(Gene *)gene becomeCurrent:(BOOL)becomeCurrent;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeGene];
    activity.title = gene.name;
    activity.webpageURL = ARWebpageURLForEntity(gene);
    activity.userInfo = @{@"id" : gene.geneID};

    if (ARSpotlightAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        activity.contentAttributeSet = [self searchAttributesWithGene:gene
                                                    includeIdentifier:NO
                                                              completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity updateContentAttributeSet:attributeSet];
        }];
    }

    if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithFair:(Fair *)fair withProfile:(Profile *)fairProfile becomeCurrent:(BOOL)becomeCurrent;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeFair];
    activity.title = fair.name;
    activity.webpageURL = ARWebpageURLForEntity(fair);
    activity.userInfo = @{@"id" : fair.fairID};

    if (ARSpotlightAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        activity.contentAttributeSet = [self searchAttributesWithFair:fair
                                                          withProfile:fairProfile
                                                    includeIdentifier:NO
                                                              completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity updateContentAttributeSet:attributeSet];
        }];
    }

    if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithShow:(PartnerShow *)show inFair:(Fair *)fair becomeCurrent:(BOOL)becomeCurrent;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeShow];
    activity.title = show.name;
    activity.webpageURL = ARWebpageURLForEntity(show);
    activity.userInfo = @{@"id" : show.showID};

    if (ARSpotlightAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        activity.contentAttributeSet = [self searchAttributesWithShow:show
                                                               inFair:fair
                                                    includeIdentifier:NO
                                                              completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity updateContentAttributeSet:attributeSet];
        }];
    }

    if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

- (void)updateContentAttributeSet:(CSSearchableItemAttributeSet *)attributeSet;
{
    ar_dispatch_main_queue(^{
        self.contentAttributeSet = attributeSet;
        self.needsSave = YES;
    });
}

@end
