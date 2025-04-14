import { sync as syncSchema } from "../../convex/sync/schema";
import { DefinitionFactory } from "local-store/react/definitionFactory";
import { DataModelFromSchemaDefinition } from "convex/server";
import { LocalDbReader, LocalDbWriter } from "local-store/react/localDb";

export type SyncDataModel = DataModelFromSchemaDefinition<typeof syncSchema>;

export const factory = new DefinitionFactory(syncSchema);

export type LocalQueryCtx = { localDb: LocalDbReader<SyncDataModel> };
export type LocalMutationCtx = { localDb: LocalDbWriter<SyncDataModel> };
