/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _CitySectionList_city$ref: unique symbol;
export type CitySectionList_city$ref = typeof _CitySectionList_city$ref;
export type CitySectionList_city = {
    readonly name: string | null;
    readonly shows: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly id: string;
                readonly _id: string;
                readonly __id: string;
                readonly is_followed: boolean | null;
                readonly start_at: string | null;
                readonly end_at: string | null;
                readonly status: string | null;
                readonly href: string | null;
                readonly type: string | null;
                readonly partner: ({
                    readonly name?: string | null;
                    readonly type?: string | null;
                }) | null;
            }) | null;
        }) | null> | null;
    }) | null;
    readonly " $refType": CitySectionList_city$ref;
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
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "type",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "CitySectionList_city",
  "type": "City",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    v0,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "shows",
      "storageKey": "shows(discoverable:true,first:50,sort:\"START_AT_ASC\")",
      "args": [
        {
          "kind": "Literal",
          "name": "discoverable",
          "value": true,
          "type": "Boolean"
        },
        {
          "kind": "Literal",
          "name": "first",
          "value": 50,
          "type": "Int"
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "START_AT_ASC",
          "type": "PartnerShowSorts"
        }
      ],
      "concreteType": "ShowConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ShowEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Show",
              "plural": false,
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
                  "name": "_id",
                  "args": null,
                  "storageKey": null
                },
                v1,
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "is_followed",
                  "args": null,
                  "storageKey": null
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
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "status",
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
                v2,
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
                      "type": "ExternalPartner",
                      "selections": [
                        v0
                      ]
                    },
                    {
                      "kind": "InlineFragment",
                      "type": "Partner",
                      "selections": [
                        v0,
                        v2
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '1ff2cdf9ac6cc36d299351c00f1632cb';
export default node;
