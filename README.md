# Convex local sync + Linear clone

This repo is an alpha of the offline sync engine for Convex. See a deployed version of the demo [here](https://linear-convex.vercel.app/).

## Installation
This monorepo depends on [PNPM](https://pnpm.io/installation) for package management.

```bash
pnpm i
cd curvilinear
npm run dev
```

Note that you can either [use a local dev server](https://stack.convex.dev/anonymous-development) without signing up for a Convex account or use a managed
cloud deployment for running the backend.

## App

Vite serves the app on port 5173. It's pretty minimal Linear clone that demonstrates:

1. Fast preloading of a page's content on initial load without any spinners
2. Storing application state in IndexedDB for offline support
3. Fully local client navigations that don't block on the server and show a spinner.
4. Mutations for creating, editing, and deleting tasks.

### Schema

The server-side schema is defined at `convex/schema.ts`. We have two tables, `issues`
and `comments`.

The local schema is defined as a *projection* of the server-side schema at
`convex/sync/schema.ts`. There are two local tables, `issues` and `comments`, and their
relationship to the underlying server tables are at `convex/sync/{issues,comments}.ts`.

We currently don't have any non-trivial mapping logic between the two data models,
so the logic in `convex/sync/issues.ts` just directly maps queries to the local table
to queries to the underlying sync table.

### Queries

On the client, the app's queries against the local store are specified in
`src/local/queries.ts`. These synchronous callbacks issue queries against a
`ctx.localDb` object, and the sync engine handles pulling in data from the
server to fulfill these queries.

React app components, like `src/pages/Issue/Comments.tsx` use the `useLocalQuery`
hook to execute one of these callbacks. The hook returns `undefined` if the data
isn't available yet, which may happen if not all relevant data was preloaded.

### Mutations

The client specifies its mutations in `src/local/mutations.ts`. These are centrally
defined since the sync engine needs to know how to replay in-progress mutations
on restart.

Mutations contain both a pointer to an authoritative server-side mutation (e.g.
`api.issues.changeStatus`) as well as a callback for mutating the local store. These
don't have to agree, and the sync engine will coordinate atomically rolling back
the local store update once the server-side change is complete and visible.

Server-side mutations are fully serializable, so a wide range of conflict resolution
strategies are possible.

## Known issues

1. Correctness. We have deterministic simulation testing set up but haven't exercised it and wrung out all the bugs yet.
2. Scale and performance. We've not optimized this for large numbers of rows managed yet.
3. Making the website part offline with PWA
4. API for reactively querying the set of in-progress mutations
5. Native client ID allocation
6. Synchronization across multiple tabs
7. Versioning and local database migrations
8. The naming isn't great, and the APIs need a lot of polish.
9. Codesharing between local optimistic updates and the authoritative server mutation.
