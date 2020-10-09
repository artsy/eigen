/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash ef3dd0ca64f47eb9d8eb89d5101e42bf */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConversationDetailsTestsQueryVariables = {
    conversationID: string;
};
export type ConversationDetailsTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"ConversationDetails_me">;
    } | null;
};
export type ConversationDetailsTestsQuery = {
    readonly response: ConversationDetailsTestsQueryResponse;
    readonly variables: ConversationDetailsTestsQueryVariables;
};



/*
query ConversationDetailsTestsQuery(
  $conversationID: String!
) {
  me {
    ...ConversationDetails_me
    id
  }
}

fragment AttachmentList_messageConnection on MessageConnection {
  edges {
    node {
      attachments {
        id
        contentType
        ...FileDownload_attachment
      }
      id
    }
  }
}

fragment AttachmentPreview_attachment on Attachment {
  internalID
}

fragment ConversationDetails_me on Me {
  conversation(id: $conversationID) {
    internalID
    id
    to {
      name
      initials
      id
    }
    from {
      email
      id
    }
    messagesConnection(first: 30, sort: DESC) {
      edges {
        __typename
        cursor
        node {
          __typename
          id
        }
      }
      ...AttachmentList_messageConnection
      pageInfo {
        endCursor
        hasNextPage
      }
    }
    items {
      item {
        __typename
        ... on Artwork {
          href
        }
        ... on Show {
          href
        }
        ...ItemInfo_item
        ... on Node {
          __isNode: __typename
          id
        }
      }
    }
  }
}

fragment FileDownload_attachment on Attachment {
  fileName
  downloadURL
  ...AttachmentPreview_attachment
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 30
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "DESC"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v7 = [
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
v8 = [
  (v2/*: any*/)
],
v9 = {
  "kind": "InlineFragment",
  "selections": (v8/*: any*/),
  "type": "Node",
  "abstractKey": "__isNode"
},
v10 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v11 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v12 = {
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
    "name": "ConversationDetailsTestsQuery",
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "ConversationDetails_me"
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
    "name": "ConversationDetailsTestsQuery",
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
            "args": [
              {
                "kind": "Variable",
                "name": "id",
                "variableName": "conversationID"
              }
            ],
            "concreteType": "Conversation",
            "kind": "LinkedField",
            "name": "conversation",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ConversationResponder",
                "kind": "LinkedField",
                "name": "to",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "initials",
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ConversationInitiator",
                "kind": "LinkedField",
                "name": "from",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "email",
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v4/*: any*/),
                "concreteType": "MessageConnection",
                "kind": "LinkedField",
                "name": "messagesConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "MessageEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "cursor",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Message",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Attachment",
                            "kind": "LinkedField",
                            "name": "attachments",
                            "plural": true,
                            "selections": [
                              (v2/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "contentType",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "fileName",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "downloadURL",
                                "storageKey": null
                              },
                              (v1/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
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
                "storageKey": "messagesConnection(first:30,sort:\"DESC\")"
              },
              {
                "alias": null,
                "args": (v4/*: any*/),
                "filters": [],
                "handle": "connection",
                "key": "Details_messagesConnection",
                "kind": "LinkedHandle",
                "name": "messagesConnection"
              },
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
                      (v5/*: any*/),
                      {
                        "kind": "TypeDiscriminator",
                        "abstractKey": "__isConversationItemType"
                      },
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": (v7/*: any*/),
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
                              (v3/*: any*/),
                              (v2/*: any*/)
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
                          (v6/*: any*/),
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
                              (v5/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v3/*: any*/)
                                ],
                                "type": "Partner",
                                "abstractKey": null
                              },
                              (v9/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": (v8/*: any*/),
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
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "type": "Show",
                        "abstractKey": null
                      },
                      (v9/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "ef3dd0ca64f47eb9d8eb89d5101e42bf",
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
        "me.conversation.from": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ConversationInitiator"
        },
        "me.conversation.from.email": (v10/*: any*/),
        "me.conversation.from.id": (v11/*: any*/),
        "me.conversation.id": (v11/*: any*/),
        "me.conversation.internalID": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ID"
        },
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
        "me.conversation.items.item.artistNames": (v12/*: any*/),
        "me.conversation.items.item.date": (v12/*: any*/),
        "me.conversation.items.item.exhibitionPeriod": (v12/*: any*/),
        "me.conversation.items.item.href": (v12/*: any*/),
        "me.conversation.items.item.id": (v11/*: any*/),
        "me.conversation.items.item.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "me.conversation.items.item.image.thumbnailUrl": (v12/*: any*/),
        "me.conversation.items.item.name": (v12/*: any*/),
        "me.conversation.items.item.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "me.conversation.items.item.partner.__isNode": (v10/*: any*/),
        "me.conversation.items.item.partner.__typename": (v10/*: any*/),
        "me.conversation.items.item.partner.id": (v11/*: any*/),
        "me.conversation.items.item.partner.name": (v12/*: any*/),
        "me.conversation.items.item.saleMessage": (v12/*: any*/),
        "me.conversation.items.item.title": (v12/*: any*/),
        "me.conversation.messagesConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MessageConnection"
        },
        "me.conversation.messagesConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "MessageEdge"
        },
        "me.conversation.messagesConnection.edges.__typename": (v10/*: any*/),
        "me.conversation.messagesConnection.edges.cursor": (v10/*: any*/),
        "me.conversation.messagesConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Message"
        },
        "me.conversation.messagesConnection.edges.node.__typename": (v10/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Attachment"
        },
        "me.conversation.messagesConnection.edges.node.attachments.contentType": (v10/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.downloadURL": (v10/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.fileName": (v10/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.id": (v11/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.internalID": (v11/*: any*/),
        "me.conversation.messagesConnection.edges.node.id": (v11/*: any*/),
        "me.conversation.messagesConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.conversation.messagesConnection.pageInfo.endCursor": (v12/*: any*/),
        "me.conversation.messagesConnection.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "me.conversation.to": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ConversationResponder"
        },
        "me.conversation.to.id": (v11/*: any*/),
        "me.conversation.to.initials": (v12/*: any*/),
        "me.conversation.to.name": (v10/*: any*/),
        "me.id": (v11/*: any*/)
      }
    },
    "name": "ConversationDetailsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '7fa1fca51112562ceb7e1cee817dbc3f';
export default node;
