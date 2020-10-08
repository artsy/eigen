/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ViewingRoomArtworkRail_viewingRoom",
  "selections": [
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
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": "artworks",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        }
      ],
      "concreteType": "ArtworkConnection",
      "kind": "LinkedField",
      "name": "artworksConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "totalCount",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ArtworkTileRail_artworksConnection"
        }
      ],
      "storageKey": "artworksConnection(first:10)"
    }
  ],
  "type": "ViewingRoom",
  "abstractKey": null
};
(node as any).hash = 'b4964f00e2bc88be12888d7ed2bc8e08';
export default node;
