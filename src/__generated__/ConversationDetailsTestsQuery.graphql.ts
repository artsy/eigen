/* tslint:disable */
/* eslint-disable */
/* @relayHash b934cfb4319a00e5a434a90587cc8b8d */

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
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
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
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v7 = [
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
],
v8 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v9 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v10 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v11 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ConversationDetailsTestsQuery",
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
            "kind": "FragmentSpread",
            "name": "ConversationDetails_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ConversationDetailsTestsQuery",
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
            "args": [
              {
                "kind": "Variable",
                "name": "id",
                "variableName": "conversationID"
              }
            ],
            "concreteType": "Conversation",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "to",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationResponder",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "initials",
                    "args": null,
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "from",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationInitiator",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "email",
                    "args": null,
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "messagesConnection",
                "storageKey": "messagesConnection(first:30,sort:\"DESC\")",
                "args": (v4/*: any*/),
                "concreteType": "MessageConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "MessageEdge",
                    "plural": true,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "cursor",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Message",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v2/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "attachments",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Attachment",
                            "plural": true,
                            "selections": [
                              (v2/*: any*/),
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "contentType",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "fileName",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "downloadURL",
                                "args": null,
                                "storageKey": null
                              },
                              (v1/*: any*/)
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "pageInfo",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "endCursor",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "hasNextPage",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": null,
                "name": "messagesConnection",
                "args": (v4/*: any*/),
                "handle": "connection",
                "key": "Details_messagesConnection",
                "filters": []
              },
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
                      (v5/*: any*/),
                      (v2/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "type": "Artwork",
                        "selections": [
                          (v6/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "image",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": (v7/*: any*/)
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
                              (v3/*: any*/),
                              (v2/*: any*/)
                            ]
                          }
                        ]
                      },
                      {
                        "kind": "InlineFragment",
                        "type": "Show",
                        "selections": [
                          (v6/*: any*/),
                          (v3/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "exhibitionPeriod",
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
                              (v5/*: any*/),
                              (v2/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "type": "Partner",
                                "selections": [
                                  (v3/*: any*/)
                                ]
                              }
                            ]
                          },
                          {
                            "kind": "LinkedField",
                            "alias": "image",
                            "name": "coverImage",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": (v7/*: any*/)
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ConversationDetailsTestsQuery",
    "id": "f8b0e7b1fa4d441a587591100b9121fd",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "type": "Me",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.id": (v8/*: any*/),
        "me.conversation": {
          "type": "Conversation",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation.internalID": (v8/*: any*/),
        "me.conversation.id": (v9/*: any*/),
        "me.conversation.to": {
          "type": "ConversationResponder",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.conversation.from": {
          "type": "ConversationInitiator",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.conversation.messagesConnection": {
          "type": "MessageConnection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation.items": {
          "type": "ConversationItem",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "me.conversation.to.name": (v10/*: any*/),
        "me.conversation.to.initials": (v11/*: any*/),
        "me.conversation.to.id": (v8/*: any*/),
        "me.conversation.from.email": (v10/*: any*/),
        "me.conversation.from.id": (v8/*: any*/),
        "me.conversation.messagesConnection.edges": {
          "type": "MessageEdge",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "me.conversation.messagesConnection.pageInfo": {
          "type": "PageInfo",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.conversation.items.item": {
          "type": "ConversationItemType",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation.messagesConnection.edges.__typename": (v10/*: any*/),
        "me.conversation.items.item.__typename": (v10/*: any*/),
        "me.conversation.messagesConnection.edges.cursor": (v10/*: any*/),
        "me.conversation.messagesConnection.edges.node": {
          "type": "Message",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation.messagesConnection.pageInfo.endCursor": (v11/*: any*/),
        "me.conversation.messagesConnection.pageInfo.hasNextPage": {
          "type": "Boolean",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.conversation.items.item.href": (v11/*: any*/),
        "me.conversation.items.item.id": (v8/*: any*/),
        "me.conversation.messagesConnection.edges.node.__typename": (v10/*: any*/),
        "me.conversation.messagesConnection.edges.node.id": (v8/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments": {
          "type": "Attachment",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "me.conversation.items.item.image": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation.items.item.title": (v11/*: any*/),
        "me.conversation.items.item.artistNames": (v11/*: any*/),
        "me.conversation.items.item.date": (v11/*: any*/),
        "me.conversation.items.item.saleMessage": (v11/*: any*/),
        "me.conversation.items.item.partner": {
          "type": "PartnerTypes",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation.items.item.name": (v11/*: any*/),
        "me.conversation.items.item.exhibitionPeriod": (v11/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.id": (v9/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.contentType": (v10/*: any*/),
        "me.conversation.items.item.image.thumbnailUrl": (v11/*: any*/),
        "me.conversation.items.item.partner.name": (v11/*: any*/),
        "me.conversation.items.item.partner.id": (v8/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.fileName": (v10/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.downloadURL": (v10/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.internalID": (v9/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = '7fa1fca51112562ceb7e1cee817dbc3f';
export default node;
