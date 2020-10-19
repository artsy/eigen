/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0b1bf56601411fe2a1cf5b1309572bcc */

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
            __isNode: __typename
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
  __isConversationItemType: __typename
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
        __isNode: __typename
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "conversationID"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v4 = [
  {
    "alias": "thumbnailUrl",
    "args": [
      {
        "kind": "Literal",
        "name": "version",
        "value": "small"
      }
    ],
    "kind": "ScalarField",
    "name": "url",
    "storageKey": "url(version:\"small\")"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = [
  (v6/*: any*/)
],
v8 = {
  "kind": "InlineFragment",
  "selections": (v7/*: any*/),
  "type": "Node",
  "abstractKey": "__isNode"
},
v9 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v10 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v11 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ItemInfoTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": "Conversation",
            "kind": "LinkedField",
            "name": "conversation",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ConversationItem",
                "kind": "LinkedField",
                "name": "items",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "item",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "ItemInfo_item"
                          }
                        ],
                        "type": "Artwork",
                        "abstractKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
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
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ItemInfoTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": "Conversation",
            "kind": "LinkedField",
            "name": "conversation",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ConversationItem",
                "kind": "LinkedField",
                "name": "items",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "item",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v3/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Image",
                                    "kind": "LinkedField",
                                    "name": "image",
                                    "plural": false,
                                    "selections": (v4/*: any*/),
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "title",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "artistNames",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "date",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "saleMessage",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Partner",
                                    "kind": "LinkedField",
                                    "name": "partner",
                                    "plural": false,
                                    "selections": [
                                      (v5/*: any*/),
                                      (v6/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "type": "Artwork",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v5/*: any*/),
                                  (v3/*: any*/),
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
                                    "concreteType": null,
                                    "kind": "LinkedField",
                                    "name": "partner",
                                    "plural": false,
                                    "selections": [
                                      (v2/*: any*/),
                                      {
                                        "kind": "InlineFragment",
                                        "selections": [
                                          (v5/*: any*/)
                                        ],
                                        "type": "Partner",
                                        "abstractKey": null
                                      },
                                      (v8/*: any*/),
                                      {
                                        "kind": "InlineFragment",
                                        "selections": (v7/*: any*/),
                                        "type": "ExternalPartner",
                                        "abstractKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "alias": "image",
                                    "args": null,
                                    "concreteType": "Image",
                                    "kind": "LinkedField",
                                    "name": "coverImage",
                                    "plural": false,
                                    "selections": (v4/*: any*/),
                                    "storageKey": null
                                  }
                                ],
                                "type": "Show",
                                "abstractKey": null
                              }
                            ],
                            "type": "ConversationItemType",
                            "abstractKey": "__isConversationItemType"
                          }
                        ],
                        "type": "Artwork",
                        "abstractKey": null
                      },
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "0b1bf56601411fe2a1cf5b1309572bcc",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.conversation": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Conversation"
        },
        "me.conversation.id": (v9/*: any*/),
        "me.conversation.items": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ConversationItem"
        },
        "me.conversation.items.item": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ConversationItemType"
        },
        "me.conversation.items.item.__isConversationItemType": (v10/*: any*/),
        "me.conversation.items.item.__isNode": (v10/*: any*/),
        "me.conversation.items.item.__typename": (v10/*: any*/),
        "me.conversation.items.item.artistNames": (v11/*: any*/),
        "me.conversation.items.item.date": (v11/*: any*/),
        "me.conversation.items.item.exhibitionPeriod": (v11/*: any*/),
        "me.conversation.items.item.href": (v11/*: any*/),
        "me.conversation.items.item.id": (v9/*: any*/),
        "me.conversation.items.item.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "me.conversation.items.item.image.thumbnailUrl": (v11/*: any*/),
        "me.conversation.items.item.name": (v11/*: any*/),
        "me.conversation.items.item.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "me.conversation.items.item.partner.__isNode": (v10/*: any*/),
        "me.conversation.items.item.partner.__typename": (v10/*: any*/),
        "me.conversation.items.item.partner.id": (v9/*: any*/),
        "me.conversation.items.item.partner.name": (v11/*: any*/),
        "me.conversation.items.item.saleMessage": (v11/*: any*/),
        "me.conversation.items.item.title": (v11/*: any*/),
        "me.id": (v9/*: any*/)
      }
    },
    "name": "ItemInfoTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'a034f53c876bb9333c6993acf188bcaa';
export default node;
