/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MarketingGroupTypes = "ArtistSeries" | "FeaturedCollections" | "OtherCollections" | "%future added value";
export type CollectionHubsRails_linkedCollections = ReadonlyArray<{
    readonly groupType: MarketingGroupTypes;
    readonly " $fragmentRefs": FragmentRefs<"CollectionArtistSeriesRail_collectionGroup" | "OtherCollectionsRail_collectionGroup" | "FeaturedCollectionsRail_collectionGroup">;
    readonly " $refType": "CollectionHubsRails_linkedCollections";
}>;
export type CollectionHubsRails_linkedCollections$data = CollectionHubsRails_linkedCollections;
export type CollectionHubsRails_linkedCollections$key = ReadonlyArray<{
    readonly " $data"?: CollectionHubsRails_linkedCollections$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionHubsRails_linkedCollections">;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CollectionHubsRails_linkedCollections",
  "type": "MarketingCollectionGroup",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "groupType",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "CollectionArtistSeriesRail_collectionGroup",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "OtherCollectionsRail_collectionGroup",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "FeaturedCollectionsRail_collectionGroup",
      "args": null
    }
  ]
};
(node as any).hash = 'b1abf030c950a4118c69eb2c9e5e5175';
export default node;
