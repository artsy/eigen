/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomViewWorksButton_viewingRoom = {
    readonly slug: string;
    readonly internalID: string;
    readonly artworksForCount: {
        readonly totalCount: number | null;
    } | null;
    readonly " $refType": "ViewingRoomViewWorksButton_viewingRoom";
};
export type ViewingRoomViewWorksButton_viewingRoom$data = ViewingRoomViewWorksButton_viewingRoom;
export type ViewingRoomViewWorksButton_viewingRoom$key = {
    readonly " $data"?: ViewingRoomViewWorksButton_viewingRoom$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomViewWorksButton_viewingRoom">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomViewWorksButton_viewingRoom",
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
      "alias": "artworksForCount",
      "name": "artworksConnection",
      "storageKey": "artworksConnection(first:1)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
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
        }
      ]
    }
  ]
};
(node as any).hash = '184db16c33d614d3d7d46953422775f7';
export default node;
