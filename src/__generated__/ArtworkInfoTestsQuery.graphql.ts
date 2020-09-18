/* tslint:disable */
/* eslint-disable */
/* @relayHash ca73679d8b2509314abc455925c27682 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkInfoTestsQueryVariables = {
    conversationID: string;
};
export type ArtworkInfoTestsQueryResponse = {
    readonly me: {
        readonly conversation: {
            readonly items: ReadonlyArray<{
                readonly item: ({
                    readonly __typename: "Artwork";
                    readonly " $fragmentRefs": FragmentRefs<"ArtworkInfo_artwork">;
                } | {
                    /*This will never be '%other', but we need some
                    value in case none of the concrete values match.*/
                    readonly __typename: "%other";
                }) | null;
            } | null> | null;
        } | null;
    } | null;
};
export type ArtworkInfoTestsQuery = {
    readonly response: ArtworkInfoTestsQueryResponse;
    readonly variables: ArtworkInfoTestsQueryVariables;
};



/*
query ArtworkInfoTestsQuery(
  $conversationID: String!
) {
  me {
    conversation(id: $conversationID) {
      items {
        item {
          __typename
          ... on Artwork {
            ...ArtworkInfo_artwork
          }
          ... on Node {
            id
          }
        }
      }
      id
    }
    id
  }
}

fragment ArtworkInfo_artwork on Artwork {
  title
  artistNames
  date
  saleMessage
  partner {
    name
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "conversationID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "conversationID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v5 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtworkInfoTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "conversation",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "Conversation",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "items",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationItem",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "item",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "type": "Artwork",
                        "selections": [
                          {
                            "kind": "FragmentSpread",
                            "name": "ArtworkInfo_artwork",
                            "args": null
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
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtworkInfoTestsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "conversation",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "Conversation",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "items",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationItem",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "item",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v3/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "type": "Artwork",
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
                              },
                              (v3/*: any*/)
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              (v3/*: any*/)
            ]
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtworkInfoTestsQuery",
    "id": "5349614b5965386d33debd779fc00957",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "type": "Me",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation": {
          "type": "Conversation",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.id": (v4/*: any*/),
        "me.conversation.items": {
          "type": "ConversationItem",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "me.conversation.id": (v4/*: any*/),
        "me.conversation.items.item": {
          "type": "ConversationItemType",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation.items.item.__typename": {
          "type": "String",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.conversation.items.item.id": (v4/*: any*/),
        "me.conversation.items.item.title": (v5/*: any*/),
        "me.conversation.items.item.artistNames": (v5/*: any*/),
        "me.conversation.items.item.date": (v5/*: any*/),
        "me.conversation.items.item.saleMessage": (v5/*: any*/),
        "me.conversation.items.item.partner": {
          "type": "Partner",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation.items.item.partner.name": (v5/*: any*/),
        "me.conversation.items.item.partner.id": (v4/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = '0ac6a68fd5329acc8dfa3503edcdeb99';
export default node;
