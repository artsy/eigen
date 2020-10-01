/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FollowArtistButton_artist = {
    readonly id: string;
    readonly slug: string;
    readonly internalID: string;
    readonly is_followed: boolean | null;
    readonly " $refType": "FollowArtistButton_artist";
};
export type FollowArtistButton_artist$data = FollowArtistButton_artist;
export type FollowArtistButton_artist$key = {
    readonly " $data"?: FollowArtistButton_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"FollowArtistButton_artist">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FollowArtistButton_artist",
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
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": "is_followed",
      "args": null,
      "kind": "ScalarField",
      "name": "isFollowed",
      "storageKey": null
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = '6a89e893f21a7504ee59138e10dcdc8e';
export default node;
