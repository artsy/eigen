/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MarketingGroupTypes = "ArtistSeries" | "FeaturedCollections" | "OtherCollections" | "%future added value";
export type OtherCollectionsRail_collectionGroup = {
    readonly groupType: MarketingGroupTypes;
    readonly name: string;
    readonly members: ReadonlyArray<{
        readonly id: string;
        readonly slug: string;
        readonly title: string;
    }>;
    readonly " $refType": "OtherCollectionsRail_collectionGroup";
};
export type OtherCollectionsRail_collectionGroup$data = OtherCollectionsRail_collectionGroup;
export type OtherCollectionsRail_collectionGroup$key = {
    readonly " $data"?: OtherCollectionsRail_collectionGroup$data;
    readonly " $fragmentRefs": FragmentRefs<"OtherCollectionsRail_collectionGroup">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OtherCollectionsRail_collectionGroup",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "groupType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "MarketingCollection",
      "kind": "LinkedField",
      "name": "members",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "slug",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "title",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MarketingCollectionGroup",
  "abstractKey": null
};
(node as any).hash = '1d3182ac2855507a513189265ece0163';
export default node;
