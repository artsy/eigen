/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MarketingGroupTypes = "ArtistSeries" | "FeaturedCollections" | "OtherCollections" | "%future added value";
export type CollectionHubsRails_linkedCollections = ReadonlyArray<{
    readonly groupType: MarketingGroupTypes;
    readonly " $fragmentRefs": FragmentRefs<"CollectionArtistSeriesRail_collectionGroup">;
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
    }
  ]
};
(node as any).hash = '30fecd1b24eb92bdd5733b4db4c166b4';
export default node;
