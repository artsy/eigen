/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionArtistSeriesRail_collection = {
    readonly slug: string;
    readonly id: string;
    readonly " $refType": "CollectionArtistSeriesRail_collection";
};
export type CollectionArtistSeriesRail_collection$data = CollectionArtistSeriesRail_collection;
export type CollectionArtistSeriesRail_collection$key = {
    readonly " $data"?: CollectionArtistSeriesRail_collection$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionArtistSeriesRail_collection">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CollectionArtistSeriesRail_collection",
  "type": "MarketingCollection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '4fc25d762cedf770e4ec928ee522ea86';
export default node;
