/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair_fair = {
    readonly id: string;
    readonly slug: string;
    readonly name: string | null;
    readonly href: string | null;
    readonly exhibitionPeriod: string | null;
    readonly image: {
        readonly imageURL: string | null;
    } | null;
    readonly location: {
        readonly city: string | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"FairDetail_fair">;
    readonly " $refType": "Fair_fair";
};
export type Fair_fair$data = Fair_fair;
export type Fair_fair$key = {
    readonly " $data"?: Fair_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair_fair">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Fair_fair",
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
      "name": "name",
      "storageKey": null
    },
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
      "name": "exhibitionPeriod",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "imageURL",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "location",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "city",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FairDetail_fair"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = 'b88e632ccff251f7cf2a939db0dbfdcc';
export default node;
