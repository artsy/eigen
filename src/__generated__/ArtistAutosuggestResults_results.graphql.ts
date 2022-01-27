/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistAutosuggestResults_results = {
    readonly results: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly imageUrl: string | null;
                readonly href: string | null;
                readonly displayLabel: string | null;
                readonly __typename: string;
                readonly internalID?: string | undefined;
                readonly displayType?: string | null | undefined;
                readonly slug?: string | undefined;
                readonly formattedNationalityAndBirthday?: string | null | undefined;
                readonly statuses?: {
                    readonly artworks: boolean | null;
                    readonly auctionLots: boolean | null;
                } | null | undefined;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ArtistAutosuggestResults_results";
};
export type ArtistAutosuggestResults_results$data = ArtistAutosuggestResults_results;
export type ArtistAutosuggestResults_results$key = {
    readonly " $data"?: ArtistAutosuggestResults_results$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"ArtistAutosuggestResults_results">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "defaultValue": [
        "ARTIST",
        "ARTWORK",
        "FAIR",
        "GENE",
        "SALE",
        "PROFILE",
        "COLLECTION"
      ],
      "kind": "LocalArgument",
      "name": "entities"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "query"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "results"
        ]
      }
    ]
  },
  "name": "ArtistAutosuggestResults_results",
  "selections": [
    {
      "alias": "results",
      "args": [
        {
          "kind": "Variable",
          "name": "entities",
          "variableName": "entities"
        },
        {
          "kind": "Literal",
          "name": "mode",
          "value": "AUTOSUGGEST"
        },
        {
          "kind": "Variable",
          "name": "query",
          "variableName": "query"
        }
      ],
      "concreteType": "SearchableConnection",
      "kind": "LinkedField",
      "name": "__ArtistAutosuggestResults_results_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "SearchableEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": null,
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "imageUrl",
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
                  "name": "displayLabel",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                },
                {
                  "kind": "InlineFragment",
                  "selections": [
                    (v0/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "displayType",
                      "storageKey": null
                    },
                    (v1/*: any*/)
                  ],
                  "type": "SearchableItem",
                  "abstractKey": null
                },
                {
                  "kind": "InlineFragment",
                  "selections": [
                    (v0/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "formattedNationalityAndBirthday",
                      "storageKey": null
                    },
                    (v1/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "ArtistStatuses",
                      "kind": "LinkedField",
                      "name": "statuses",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "artworks",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "auctionLots",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "type": "Artist",
                  "abstractKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();
(node as any).hash = 'bff21f0f93fc91d7a8c41cfd1392ec30';
export default node;
