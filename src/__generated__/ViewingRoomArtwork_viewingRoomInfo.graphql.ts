/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomArtwork_viewingRoomInfo = {
    readonly title: string;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly heroImageURL: string | null;
    readonly status: string;
    readonly distanceToOpen: string | null;
    readonly distanceToClose: string | null;
    readonly slug: string;
    readonly " $refType": "ViewingRoomArtwork_viewingRoomInfo";
};
export type ViewingRoomArtwork_viewingRoomInfo$data = ViewingRoomArtwork_viewingRoomInfo;
export type ViewingRoomArtwork_viewingRoomInfo$key = {
    readonly " $data"?: ViewingRoomArtwork_viewingRoomInfo$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomArtwork_viewingRoomInfo">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomArtwork_viewingRoomInfo",
  "type": "ViewingRoom",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": "Partner",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "heroImageURL",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "status",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "distanceToOpen",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "distanceToClose",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'ab84d1969c6165e939d89262e6bc8971';
export default node;
