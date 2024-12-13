import { sync as syncSchema } from "../convex/sync/schema";
import { ConvexReactClient } from "convex/react";
import { CoreSyncEngine } from "local-store/browser/core/core";
import { Driver } from "local-store/browser/driver";
import {
  IndexedDbPersistence,
  NoopLocalPersistence,
} from "local-store/browser/localPersistence";
import { Logger } from "local-store/browser/logger";
import { NetworkImpl } from "local-store/browser/network";
import { LocalStoreClient } from "local-store/browser/ui";
import { MutationRegistry } from "local-store/react/mutationRegistry";
import {
  createIssue,
  changeStatus,
  changePriority,
  changeTitle,
  changeDescription,
  deleteIssue,
  postComment,
} from "./local/mutations";

export const clerkPubKey =
  "pk_test_c3BlY2lhbC1tYWNrZXJlbC04Ni5jbGVyay5hY2NvdW50cy5kZXYk";
export const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL as string,
);

const mutationRegistry = new MutationRegistry(syncSchema);
mutationRegistry
  .register(createIssue)
  .register(changeStatus)
  .register(changePriority)
  .register(changeTitle)
  .register(changeDescription)
  .register(deleteIssue)
  .register(postComment);

console.log("Creating persistence!");
const persistence = new IndexedDbPersistence("curvilinear");
const logger = new Logger();
const mutationMap = mutationRegistry.exportToMutationMap();
const coreLocalStore = new CoreSyncEngine(syncSchema, mutationMap, logger);
const driver = new Driver({
  coreLocalStore,
  network: new NetworkImpl({ convexClient: (convex as any).sync }),
  localPersistence: persistence ?? new NoopLocalPersistence(),
  logger,
});
export const localStore = new LocalStoreClient({
  driver,
  syncSchema,
  mutations: mutationMap,
});
