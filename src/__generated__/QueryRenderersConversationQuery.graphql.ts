/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Conversation_me$ref } from "./Conversation_me.graphql";
export type QueryRenderersConversationQueryVariables = {
    readonly conversationID: string;
};
export type QueryRenderersConversationQueryResponse = {
    readonly me: ({
        readonly " $fragmentRefs": Conversation_me$ref;
    }) | null;
};
export type QueryRenderersConversationQuery = {
    readonly response: QueryRenderersConversationQueryResponse;
    readonly variables: QueryRenderersConversationQueryVariables;
};



/*
query QueryRenderersConversationQuery(
  $conversationID: String!
) {
  me {
    ...Conversation_me
    id
  }
}

fragment Conversation_me on Me {
  conversation(id: $conversationID) {
    internalID
    id
    to {
      name
      initials
    }
    from {
      email
    }
    last_message_id
    ...Messages_conversation
    initial_message
    unread
  }
}

fragment Messages_conversation on Conversation {
  id
  internalID
  from {
    name
    email
    initials
  }
  to {
    name
    initials
  }
  initial_message
  messages(first: 10, sort: DESC) {
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
        impulse_id
        is_from_user
        body
        attachments {
          internalID
        }
        ...Message_message
        __typename
      }
    }
  }
  items {
    artwork: item {
      __typename
      ... on Artwork {
        href
        ...ArtworkPreview_artwork
      }
      ... on Node {
        id
      }
    }
    show: item {
      __typename
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

fragment Message_message on Message {
  body
  created_at
  is_from_user
  from {
    name
    email
  }
  invoice {
    payment_url
    ...InvoicePreview_invoice
    id
  }
  attachments {
    internalID
    content_type
    download_url
    file_name
    ...ImagePreview_attachment
    ...PDFPreview_attachment
  }
}

fragment ArtworkPreview_artwork on Artwork {
  gravityID
  _id
  title
  artist_names
  date
  image {
    url
  }
}

fragment ShowPreview_show on Show {
  gravityID
  _id
  name
  cover_image {
    url
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

fragment InvoicePreview_invoice on Invoice {
  payment_url
  state
  total
  lewitt_invoice_id
}

fragment ImagePreview_attachment on Attachment {
  download_url
  ...AttachmentPreview_attachment
}

fragment PDFPreview_attachment on Attachment {
  file_name
  ...AttachmentPreview_attachment
}

fragment AttachmentPreview_attachment on Attachment {
  internalID
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
    "value": 10,
    "type": "Int"
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "DESC",
    "type": "sort"
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
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "_id",
  "args": null,
  "storageKey": null
},
v11 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersConversationQuery",
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
    "name": "QueryRenderersConversationQuery",
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
                "variableName": "conversationID",
                "type": "String!"
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
                  (v3/*: any*/),
                  (v4/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "last_message_id",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "initial_message",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "messages",
                "storageKey": "messages(first:10,sort:\"DESC\")",
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
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "impulse_id",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_from_user",
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
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "attachments",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Attachment",
                            "plural": true,
                            "selections": [
                              (v1/*: any*/),
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "content_type",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "download_url",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "file_name",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "created_at",
                            "args": null,
                            "storageKey": null
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
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "invoice",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Invoice",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "payment_url",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "state",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "total",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "lewitt_invoice_id",
                                "args": null,
                                "storageKey": null
                              },
                              (v2/*: any*/)
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
                "name": "messages",
                "args": (v6/*: any*/),
                "handle": "connection",
                "key": "Messages_messages",
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
                    "alias": "artwork",
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
                          (v10/*: any*/),
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
                            "name": "artist_names",
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
                            "selections": (v11/*: any*/)
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": "show",
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
                        "type": "Show",
                        "selections": [
                          (v8/*: any*/),
                          (v9/*: any*/),
                          (v10/*: any*/),
                          (v3/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "cover_image",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": (v11/*: any*/)
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
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "unread",
                "args": null,
                "storageKey": null
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
    "name": "QueryRenderersConversationQuery",
    "id": "fe5889d5a36fd2a36e81e4d6f595a8b1",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'fe5889d5a36fd2a36e81e4d6f595a8b1';
export default node;
