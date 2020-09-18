/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkInfo_artwork = {
    readonly title: string | null;
    readonly artistNames: string | null;
    readonly date: string | null;
    readonly saleMessage: string | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly " $refType": "ArtworkInfo_artwork";
};
export type ArtworkInfo_artwork$data = ArtworkInfo_artwork;
export type ArtworkInfo_artwork$key = {
    readonly " $data"?: ArtworkInfo_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkInfo_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtworkInfo_artwork",
  "type": "Artwork",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "artistNames",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "date",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "saleMessage",
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
    }
  ]
};
(node as any).hash = 'ad27f2b1009579b50b2d358d61f98283';
export default node;
