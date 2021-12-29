/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Artwork_artworkAboveTheFold = {
    readonly slug: string;
    readonly internalID: string;
    readonly id: string;
    readonly isAcquireable: boolean | null;
    readonly isOfferable: boolean | null;
    readonly isBiddable: boolean | null;
    readonly isInquireable: boolean | null;
    readonly availability: string | null;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkHeader_artwork" | "CommercialInformation_artwork">;
    readonly " $refType": "Artwork_artworkAboveTheFold";
};
export type Artwork_artworkAboveTheFold$data = Artwork_artworkAboveTheFold;
export type Artwork_artworkAboveTheFold$key = {
    readonly " $data"?: Artwork_artworkAboveTheFold$data | undefined;
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
      "name": "isAcquireable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isOfferable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isBiddable",
      "storageKey": null
    },
    {
      "alias": null,
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
(node as any).hash = 'c7e0471ac09152c03d21e8f069bf80fb';
export default node;
