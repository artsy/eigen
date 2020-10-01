/* tslint:disable */
/* eslint-disable */
/* @relayHash de9b5a685f287631cadbaf71fee139c6 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ItemInfoTestsQueryVariables = {
    conversationID: string;
};
export type ItemInfoTestsQueryResponse = {
    readonly me: {
        readonly conversation: {
            readonly items: ReadonlyArray<{
                readonly item: ({
                    readonly __typename: "Artwork";
                    readonly " $fragmentRefs": FragmentRefs<"ItemInfo_item">;
                } | {
                    /*This will never be '%other', but we need some
                    value in case none of the concrete values match.*/
                    readonly __typename: "%other";
                }) | null;
            } | null> | null;
        } | null;
    } | null;
};
export type ItemInfoTestsQuery = {
    readonly response: ItemInfoTestsQueryResponse;
    readonly variables: ItemInfoTestsQueryVariables;
};



/*
query ItemInfoTestsQuery(
  $conversationID: String!
) {
  me {
    conversation(id: $conversationID) {
      items {
        item {
          __typename
          ... on Artwork {
            ...ItemInfo_item
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

fragment ItemInfo_item on ConversationItemType {
  __typename
  ... on Artwork {
    href
    image {
      thumbnailUrl: url(version: "small")
    }
    title
    artistNames
    date
    saleMessage
    partner {
      name
      id
    }
  }
  ... on Show {
    name
    href
    exhibitionPeriod
    partner {
      __typename
      ... on Partner {
        name
      }
      ... on Node {
        id
      }
      ... on ExternalPartner {
        id
      }
    }
    image: coverImage {
      thumbnailUrl: url(version: "small")
    }
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
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v6 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ItemInfoTestsQuery",
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
                            "name": "ItemInfo_item",
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
    "name": "ItemInfoTestsQuery",
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
                            "name": "href",
                            "args": null,
                            "storageKey": null
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
                                "alias": "thumbnailUrl",
                                "name": "url",
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "version",
                                    "value": "small"
                                  }
                                ],
                                "storageKey": "url(version:\"small\")"
                              }
                            ]
                          },
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
                              (v4/*: any*/),
                              (v3/*: any*/)
                            ]
                          },
                          {
                            "kind": "InlineFragment",
                            "type": "Show",
                            "selections": [
                              (v4/*: any*/),
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "exhibitionPeriod",
                                "args": null,
                                "storageKey": null
                              }
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
    "name": "ItemInfoTestsQuery",
    "id": "705b778f66a50fdd540e4b97c02262ad",
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
        "me.id": (v5/*: any*/),
        "me.conversation.items": {
          "type": "ConversationItem",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "me.conversation.id": (v5/*: any*/),
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
        "me.conversation.items.item.id": (v5/*: any*/),
        "me.conversation.items.item.href": (v6/*: any*/),
        "me.conversation.items.item.image": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation.items.item.title": (v6/*: any*/),
        "me.conversation.items.item.artistNames": (v6/*: any*/),
        "me.conversation.items.item.date": (v6/*: any*/),
        "me.conversation.items.item.saleMessage": (v6/*: any*/),
        "me.conversation.items.item.partner": {
          "type": "PartnerTypes",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation.items.item.name": (v6/*: any*/),
        "me.conversation.items.item.exhibitionPeriod": (v6/*: any*/),
        "me.conversation.items.item.image.thumbnailUrl": (v6/*: any*/),
        "me.conversation.items.item.partner.name": (v6/*: any*/),
        "me.conversation.items.item.partner.id": (v5/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = 'a034f53c876bb9333c6993acf188bcaa';
export default node;
