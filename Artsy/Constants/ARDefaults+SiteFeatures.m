#import "ARDefaults+SiteFeatures.h"

#import "SiteFeature.h"


@implementation ARDefaults (SiteFeatures)

+ (void)setOnboardingDefaults:(NSArray *)features
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSArray *booleans = @[

    ];

    for (SiteFeature *feature in features) {
        if ([booleans containsObject:feature.siteFeatureID]) {
            [defaults setObject:feature.enabled forKey:feature.siteFeatureID];

        }
    }
    [defaults synchronize];
}


@end
