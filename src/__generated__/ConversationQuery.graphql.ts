/* tslint:disable */
/* eslint-disable */
/* @relayHash 9da6f5e3d1c3b25af79ac7d2c3d4423b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConversationQueryVariables = {
    conversationID: string;
};
export type ConversationQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Conversation_me">;
    } | null;
};
export type ConversationQuery = {
    readonly response: ConversationQueryResponse;
    readonly variables: ConversationQueryVariables;
};



/*
query ConversationQuery(
  $conversationID: String!
) {
  me {
    ...Conversation_me
    id
  }
}

fragment ArtworkPreview_artwork on Artwork {
  slug
  internalID
  title
  artist_names: artistNames
  date
  image {
    url
    aspectRatio
  }
}

fragment AttachmentPreview_attachment on Attachment {
  internalID
}

fragment Conversation_me on Me {
  conversation(id: $conversationID) {
    internalID
    id
    lastMessageID
    unread
    to {
      name
      id
    }
    from {
      email
      id
    }
    ...Messages_conversation
  }
}

fragment FileDownload_attachment on Attachment {
  fileName
  downloadURL
  ...AttachmentPreview_attachment
}

fragment ImagePreview_attachment on Attachment {
  download_url: downloadURL
  ...AttachmentPreview_attachment
}

fragment Message_message on Message {
  body
  createdAt
  internalID
  isFromUser
  isFirstMessage
  from {
    name
    email
  }
  attachments {
    id
    internalID
    contentType
    downloadURL
    fileName
    ...ImagePreview_attachment
    ...PDFPreview_attachment
    ...FileDownload_attachment
  }
}

fragment Messages_conversation on Conversation {
  id
  internalID
  from {
    name
    email
    initials
    id
  }
  to {
    name
    initials
    id
  }
  initial_message: initialMessage
  lastMessageID
  messagesConnection(first: 10, sort: DESC) {
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        internalID
        impulseID
        isFromUser
        isFirstMessage
        body
        createdAt
        attachments {
          id
          internalID
          contentType
          downloadURL
          fileName
          ...ImagePreview_attachment
          ...PDFPreview_attachment
          ...FileDownload_attachment
        }
        ...Message_message
        __typename
      }
    }
  }
  items {
    item {
      __typename
      ... on Artwork {
        href
        ...ArtworkPreview_artwork
      }
      ... on Show {
        href
        ...ShowPreview_show
      }
      ... on Node {
        id
      }
    }
  }
}

fragment PDFPreview_attachment on Attachment {
  fileName
  ...AttachmentPreview_attachment
}

fragment ShowPreview_show on Show {
  slug
  internalID
  name
  coverImage {
    url
    aspectRatio
  }
  fair {
    name
    id
  }
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
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "initials",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "email",
  "args": null,
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "DESC"
  }
],
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v10 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "aspectRatio",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ConversationQuery",
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
            "name": "Conversation_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ConversationQuery",
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
                "kind": "ScalarField",
                "alias": null,
                "name": "lastMessageID",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "unread",
                "args": null,
                "storageKey": null
              },
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
                  (v2/*: any*/),
                  (v4/*: any*/)
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
                  (v5/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": "initial_message",
                "name": "initialMessage",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "messagesConnection",
                "storageKey": "messagesConnection(first:10,sort:\"DESC\")",
                "args": (v6/*: any*/),
                "concreteType": "MessageConnection",
                "plural": false,
                "selections": [
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
                        "name": "startCursor",
                        "args": null,
                        "storageKey": null
                      },
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
                        "name": "hasPreviousPage",
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
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "MessageEdge",
                    "plural": true,
                    "selections": [
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
                          (v2/*: any*/),
                          (v1/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "impulseID",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "isFromUser",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "isFirstMessage",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "body",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "createdAt",
                            "args": null,
                            "storageKey": null
                          },
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
                              (v1/*: any*/),
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
                                "name": "downloadURL",
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
                                "alias": "download_url",
                                "name": "downloadURL",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "from",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "MessageInitiator",
                            "plural": false,
                            "selections": [
                              (v3/*: any*/),
                              (v5/*: any*/)
                            ]
                          },
                          (v7/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": null,
                "name": "messagesConnection",
                "args": (v6/*: any*/),
                "handle": "connection",
                "key": "Messages_messagesConnection",
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
                      (v7/*: any*/),
                      (v2/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "type": "Artwork",
                        "selections": [
                          (v8/*: any*/),
                          (v9/*: any*/),
                          (v1/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "title",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "artist_names",
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
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "image",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": (v10/*: any*/)
                          }
                        ]
                      },
                      {
                        "kind": "InlineFragment",
                        "type": "Show",
                        "selections": [
                          (v8/*: any*/),
                          (v9/*: any*/),
                          (v1/*: any*/),
                          (v3/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "coverImage",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": (v10/*: any*/)
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "fair",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Fair",
                            "plural": false,
                            "selections": [
                              (v3/*: any*/),
                              (v2/*: any*/)
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
                              (v7/*: any*/),
                              (v2/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "type": "Partner",
                                "selections": [
                                  (v3/*: any*/)
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
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ConversationQuery",
    "id": "320001cf3eebfa1d03a8e688b53179bc",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'd45464a0b4ebc0c7eb45f4c296c8efb6';
export default node;
