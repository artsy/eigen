/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoom_viewingRoom = {
    readonly body: string | null;
    readonly pullQuote: string | null;
    readonly introStatement: string | null;
    readonly slug: string;
    readonly internalID: string;
    readonly status: string;
    readonly partner: {
        readonly href: string | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomViewWorksButton_viewingRoom" | "ViewingRoomSubsections_viewingRoom" | "ViewingRoomArtworkRail_viewingRoom" | "ViewingRoomHeader_viewingRoom">;
    readonly " $refType": "ViewingRoom_viewingRoom";
};
export type ViewingRoom_viewingRoom$data = ViewingRoom_viewingRoom;
export type ViewingRoom_viewingRoom$key = {
    readonly " $data"?: ViewingRoom_viewingRoom$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoom_viewingRoom">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ViewingRoom_viewingRoom",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "body",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pullQuote",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "introStatement",
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
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Partner",
      "kind": "LinkedField",
      "name": "partner",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "href",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ViewingRoomViewWorksButton_viewingRoom"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ViewingRoomSubsections_viewingRoom"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ViewingRoomArtworkRail_viewingRoom"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ViewingRoomHeader_viewingRoom"
    }
  ],
  "type": "ViewingRoom",
  "abstractKey": null
};
(node as any).hash = '614ec672cf76d2e4f935c2b94ffa35a0';
export default node;
