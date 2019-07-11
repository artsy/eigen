/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _FollowArtistButton_artist$ref: unique symbol;
export type FollowArtistButton_artist$ref = typeof _FollowArtistButton_artist$ref;
export type FollowArtistButton_artist = {
    readonly gravityID: string;
    readonly id: string;
    readonly is_followed: boolean | null;
    readonly " $refType": FollowArtistButton_artist$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FollowArtistButton_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "gravityID",
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
    }
  ]
};
(node as any).hash = '6ea43b005937371481718fed3a9c9f7d';
export default node;
