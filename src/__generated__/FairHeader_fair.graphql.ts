/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _FairHeader_fair$ref: unique symbol;
export type FairHeader_fair$ref = typeof _FairHeader_fair$ref;
export type FairHeader_fair = {
    readonly id: string;
    readonly name: string | null;
    readonly exhibitors_grouped_by_name: ReadonlyArray<({
        readonly exhibitors: ReadonlyArray<string | null> | null;
    }) | null> | null;
    readonly image: ({
        readonly image_url: string | null;
        readonly aspect_ratio: number;
        readonly url: string | null;
    }) | null;
    readonly profile: ({
        readonly icon: ({
            readonly id: string | null;
            readonly href: string | null;
            readonly height: number | null;
            readonly width: number | null;
            readonly url: string | null;
        }) | null;
        readonly name: string | null;
    }) | null;
    readonly start_at: string | null;
    readonly end_at: string | null;
    readonly " $refType": FairHeader_fair$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "FairHeader_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    v0,
    v1,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "exhibitors_grouped_by_name",
      "storageKey": null,
      "args": null,
      "concreteType": "FairExhibitorsGroup",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "exhibitors",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "image",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "image_url",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "aspect_ratio",
          "args": null,
          "storageKey": null
        },
        v2
      ]
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
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "icon",
          "storageKey": null,
          "args": null,
          "concreteType": "Image",
          "plural": false,
          "selections": [
            v0,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "href",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "height",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "width",
              "args": null,
              "storageKey": null
            },
            v2
          ]
        },
        v1,
        v3
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "start_at",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "end_at",
      "args": null,
      "storageKey": null
    },
    v3
  ]
};
})();
(node as any).hash = 'a82c38748e6b1574c6d8d1e6269e3ac9';
export default node;
