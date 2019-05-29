/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _FollowArtistButton_artist$ref: unique symbol;
export type FollowArtistButton_artist$ref = typeof _FollowArtistButton_artist$ref;
export type FollowArtistButton_artist = {
    readonly __id: string;
    readonly id: string;
    readonly is_followed: boolean | null;
    readonly counts: ({
        readonly follows: any | null;
    }) | null;
    readonly " $refType": FollowArtistButton_artist$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "FollowArtistButton_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_followed",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtistCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "follows",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '3d95f3ba8843502253efacc9c5d3d5f9';
export default node;
