/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoom_viewingRoom = {
    readonly body: string | null;
    readonly introStatement: string | null;
    readonly internalID: string;
    readonly partner: {
        readonly href: string | null;
        readonly name: string | null;
    } | null;
    readonly pullQuote: string | null;
    readonly slug: string;
    readonly status: string;
    readonly title: string;
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
      "name": "introStatement",
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
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        }
      ],
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
      "name": "slug",
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
      "kind": "ScalarField",
      "name": "title",
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
(node as any).hash = 'df57f83b52fa8a39e1e6cdfd48be20fb';
export default node;
