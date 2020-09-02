/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Artwork_artworkAboveTheFold = {
    readonly slug: string;
    readonly internalID: string;
    readonly id: string;
    readonly title: string | null;
    readonly artist: {
        readonly name: string | null;
    } | null;
    readonly medium: string | null;
    readonly is_acquireable: boolean | null;
    readonly is_offerable: boolean | null;
    readonly is_biddable: boolean | null;
    readonly is_inquireable: boolean | null;
    readonly availability: string | null;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkHeader_artwork" | "CommercialInformation_artwork">;
    readonly " $refType": "Artwork_artworkAboveTheFold";
};
export type Artwork_artworkAboveTheFold$data = Artwork_artworkAboveTheFold;
export type Artwork_artworkAboveTheFold$key = {
    readonly " $data"?: Artwork_artworkAboveTheFold$data;
    readonly " $fragmentRefs": FragmentRefs<"Artwork_artworkAboveTheFold">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Artwork_artworkAboveTheFold",
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
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artist",
      "plural": false,
      "selections": [
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
      "name": "medium",
      "storageKey": null
    },
    {
      "alias": "is_acquireable",
      "args": null,
      "kind": "ScalarField",
      "name": "isAcquireable",
      "storageKey": null
    },
    {
      "alias": "is_offerable",
      "args": null,
      "kind": "ScalarField",
      "name": "isOfferable",
      "storageKey": null
    },
    {
      "alias": "is_biddable",
      "args": null,
      "kind": "ScalarField",
      "name": "isBiddable",
      "storageKey": null
    },
    {
      "alias": "is_inquireable",
      "args": null,
      "kind": "ScalarField",
      "name": "isInquireable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "availability",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworkHeader_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CommercialInformation_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '41d78f5c61faaf27210fd00d32ce3930';
export default node;
