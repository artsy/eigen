/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistHeader_artist = {
    readonly id: string;
    readonly internalID: string;
    readonly slug: string;
    readonly isFollowed: boolean | null;
    readonly name: string | null;
    readonly nationality: string | null;
    readonly birthday: string | null;
    readonly counts: {
        readonly forSaleArtworks: number | null;
        readonly follows: number | null;
    } | null;
    readonly " $refType": "ArtistHeader_artist";
};
export type ArtistHeader_artist$data = ArtistHeader_artist;
export type ArtistHeader_artist$key = {
    readonly " $data"?: ArtistHeader_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistHeader_artist">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtistHeader_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
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
      "name": "isFollowed",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "nationality",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "birthday",
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
          "name": "forSaleArtworks",
          "args": null,
          "storageKey": null
        },
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
(node as any).hash = 'c61f1e5257d78442d75432e7e863b122';
export default node;
