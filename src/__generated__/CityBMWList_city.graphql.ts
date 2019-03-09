/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _CityBMWList_city$ref: unique symbol;
export type CityBMWList_city$ref = typeof _CityBMWList_city$ref;
export type CityBMWList_city = {
    readonly shows: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly id: string;
                readonly _id: string;
                readonly __id: string;
                readonly name: string | null;
                readonly status: string | null;
                readonly href: string | null;
                readonly is_followed: boolean | null;
                readonly exhibition_period: string | null;
                readonly cover_image: ({
                    readonly url: string | null;
                }) | null;
                readonly location: ({
                    readonly coordinates: ({
                        readonly lat: number | null;
                        readonly lng: number | null;
                    }) | null;
                }) | null;
                readonly type: string | null;
                readonly start_at: string | null;
                readonly end_at: string | null;
                readonly partner: ({
                    readonly name?: string | null;
                    readonly type?: string | null;
                }) | null;
            }) | null;
        }) | null> | null;
    }) | null;
    readonly " $refType": CityBMWList_city$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
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
  "name": "type",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "CityBMWList_city",
  "type": "City",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 20
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": ""
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "shows",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "after",
          "variableName": "cursor",
          "type": "String"
        },
        {
          "kind": "Literal",
          "name": "discoverable",
          "value": true,
          "type": "Boolean"
        },
        {
          "kind": "Variable",
          "name": "first",
          "variableName": "count",
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
                  "name": "exhibition_period",
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
                v0,
                v1,
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
                  "name": "_id",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "cover_image",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Image",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "url",
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
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "coordinates",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "LatLng",
                      "plural": false,
                      "selections": [
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "lat",
                          "args": null,
                          "storageKey": null
                        },
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "lng",
                          "args": null,
                          "storageKey": null
                        }
                      ]
                    },
                    v0
                  ]
                },
                v2,
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
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "partner",
                  "storageKey": null,
                  "args": null,
                  "concreteType": null,
                  "plural": false,
                  "selections": [
                    v0,
                    {
                      "kind": "InlineFragment",
                      "type": "ExternalPartner",
                      "selections": [
                        v1
                      ]
                    },
                    {
                      "kind": "InlineFragment",
                      "type": "Partner",
                      "selections": [
                        v1,
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
(node as any).hash = '4b8ee56d387f60fcddc678e11aed490a';
export default node;
