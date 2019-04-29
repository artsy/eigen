/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _FairBoothHeader_show$ref: unique symbol;
export type FairBoothHeader_show$ref = typeof _FairBoothHeader_show$ref;
export type FairBoothHeader_show = {
    readonly fair: ({
        readonly name: string | null;
    }) | null;
    readonly partner: ({
        readonly name?: string | null;
        readonly gravityID?: string;
        readonly internalID?: string;
        readonly id?: string;
        readonly href?: string | null;
        readonly profile?: ({
            readonly internalID: string;
            readonly gravityID: string;
            readonly is_followed: boolean | null;
        }) | null;
    }) | null;
    readonly counts: ({
        readonly artworks: number | null;
        readonly artists: number | null;
    }) | null;
    readonly location: ({
        readonly display: string | null;
    }) | null;
    readonly " $refType": FairBoothHeader_show$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "FairBoothHeader_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "fair",
      "storageKey": null,
      "args": null,
      "concreteType": "Fair",
      "plural": false,
      "selections": [
        v0,
        v1
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        v1,
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": [
            v0,
            v2,
            v3,
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
              "name": "href",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "profile",
              "storageKey": null,
              "args": null,
              "concreteType": "Profile",
              "plural": false,
              "selections": [
                v3,
                v2,
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "is_followed",
                  "args": null,
                  "storageKey": null
                },
                v1
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "ShowCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artworks",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artists",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "location",
      "storageKey": null,
      "args": null,
      "concreteType": "Location",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "display",
          "args": null,
          "storageKey": null
        },
        v1
      ]
    },
    v1
  ]
};
})();
(node as any).hash = '2850f4093230d8302d5bbb0d667de960';
export default node;
