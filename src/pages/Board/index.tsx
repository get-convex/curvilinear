import TopFilter from "../../components/TopFilter";
import IssueBoard from "./IssueBoard";
import { useFilterState } from "../../utils/filterState";
import { Issue } from "../../types/types";
import { useSyncQuery } from "local-store/react/LocalStoreProvider";
import { loadAllIssues } from "@/queries";

function Board() {
  const [_filterState] = useFilterState();
  const issues: Issue[] =
    useSyncQuery(loadAllIssues, {}, "loadAllIssues") ?? [];
  // TODO: apply filter state
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopFilter title="Board" issues={issues} hideSort={true} />
      <IssueBoard issues={issues} />
    </div>
  );
}

export default Board;
