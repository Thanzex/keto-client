# Ory Keto Client
Unofficial Javascript / Typescript client for [Ory Keto](https://github.com/ory/keto) using Axios.

This package is currently compatible with Keto **v0.8.0-alpha.2** 

## Usage

### Typescript:

```ts
import { Keto } from 'keto-client'

const api = new Keto.Client({
    readUrl: "keto.url:4466",
    writeUrl: "keto.url:4467",
    axios: {}, // Optional Axios Config
    headers: {} // Optional Request Headers
})
```

### Javascript

```js 
const Keto = require("keto-client").Keto

const api = new Keto.Client({
    readUrl: "keto.url:4466",
    writeUrl: "keto.url:4467",
    axios: {}, // Optional Axios Config
    headers: {} // Optional Request Headers
})
```

### Metadata API

#### Liveness Check

```ts
const { status } = await api.MetadataApi.GetServerStatus()
```

#### Readiness Check

```ts
const { status } = await api.MetadataApi.GetServerAndDatabaseStatus()
```

#### Version Check

```ts
const { version } = await api.MetadataApi.GetVersion()
```

### Read API

#### Check Tuple

NOTE: According to the Official Ory Keto documentation there are two endpoints to check a tuple, one using a GET request, one using a POST request, for completeness both are implemented, both take the same input and return the same output, the two method are `Keto.ReadApi.CheckGet` and  `Keto.ReadApi.CheckPost`.


```ts
const { allowed } = await api.ReadApi.CheckGet({
    namespace: "books",
    object: "book1",
    relation: "read",
    subject_id: "user1234",
    max_depth: 5,
})
```

Using a Subject Set:
```ts
const { allowed } = await api.ReadApi.CheckGet({
    namespace: "books",
    object: "book1",
    relation: "read",
    subject_set: {
        namespace: "groups",
        object: "readers",
        relation: "member"
    },
    max_depth: 5,
})
```

#### Expand tuple

```ts
const subjects: ExpandResponse = await api.ReadApi.Expand({
    namespace: "books",
    object: "book1",
    relation: "read",
    max_depth: 5
})

interface ExpandResponse {
    children: ExpandResponse[]
    subject_set?: SubjectSet
    subject_id?: string
    type: string
}
```

#### Query 

NOTE: Only the namespace field is required

```ts
// Get all tuples in namespace books, 100 at a time, starting from token
const tuples = await api.ReadApi.Query({
    namespace: "books"
    page_size: 100,
    page_token: "..."
})

// Get all tuples in namespace books related to object book1
const tuples = await api.ReadApi.Query({
    namespace: "books",
    object: "book1"
})

// Get all tuples in namespace books related to subject user1234
const tuples = await api.ReadApi.Query({
    namespace: "books",
    subject_id: "user1234"
})

// Get all tuples in namespace books related to subject set readers
const tuples = await api.ReadApi.Query({
    namespace: "books",
    "subject_set.namespace": "groups",
    "subject_set.object": "readers"
})

type QueryResponse = {
    next_page_token: string
    relation_tuples: RelationTuple[]
}

type RelationTuple = {
    namespace: string
    object: string
    relation: string
    subject_id?: string
    subject_set?: SubjectSet
}
```

### Write API

#### Create

```ts
const tuple = await api.WriteApi.Create({
    namespace: "books",
    object: "book1",
    relation: "read",
    subject_id: "user1234"
})
```

#### Delete

```ts
await api.WriteApi.Delete({
    namespace: "books",
    object: "book1",
    relation: "read",
    subject_id: "user1234"
})

await api.WriteApi.Delete({
    namespace: "books",
    object: "book1",
    relation: "read",
    subject_set: {
        namespace: "groups",
        object: "readers",
        relation: "member"
    }
})
```

#### Patch Multiple

```ts
const data: PatchMultipleRequest = [
    {
        action: "insert",
        relation_tuple: {
            namespace: "books",
            object: "book1",
            relation: "read",
            subject_id: "user1234"
        }
    },
    {
        action: "insert",
        relation_tuple: {
            namespace: "books",
            object: "book1",
            relation: "read",
            subject_set: {
                namespace: "groups",
                object: "readers",
                relation: "member"
            }
        }
    },
    {
        action: "delete",
        relation_tuple: {
            namespace: "books",
            object: "book2",
            relation: "read",
            subject_id: "user1234"
        }
    },
    ...
]

await api.WriteApi.PatchMultiple(data)
```


## Why Does This Exist
I created this package since the official JS/TS version is auto-generated from the API config using OpenAPI Generator and I found it extremely impractical to use.
