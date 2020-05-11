/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomArtworkRail_viewingRoom = {
    readonly slug: string;
    readonly internalID: string;
    readonly artworks: {
        readonly totalCount: number | null;
        readonly " $fragmentRefs": FragmentRefs<"ArtworkTileRail_artworksConnection">;
    } | null;
    readonly " $refType": "ViewingRoomArtworkRail_viewingRoom";
};
export type ViewingRoomArtworkRail_viewingRoom$data = ViewingRoomArtworkRail_viewingRoom;
export type ViewingRoomArtworkRail_viewingRoom$key = {
    readonly " $data"?: ViewingRoomArtworkRail_viewingRoom$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomArtworkRail_viewingRoom">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomArtworkRail_viewingRoom",
  "type": "ViewingRoom",
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
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "artworks",
      "name": "artworksConnection",
      "storageKey": "artworksConnection(first:5)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 5
        }
      ],
      "concreteType": "ArtworkConnection",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "totalCount",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "FragmentSpread",
          "name": "ArtworkTileRail_artworksConnection",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = '3086d7fb3cfee740b8ea41fd654fee7f';
export default node;
