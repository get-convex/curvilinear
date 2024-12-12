import TopFilter from "../../components/TopFilter";
import IssueBoard from "./IssueBoard";
import { useFilterState } from "../../utils/filterState";
import { Issue } from "../../types/types";
import { useLocalQuery } from "local-store/react/hooks";
import { loadAllIssues } from "@/local/queries";

function Board() {
  const [_filterState] = useFilterState();
  const issues: Issue[] =
    useLocalQuery(loadAllIssues, {}, "loadAllIssues") ?? [];
  // TODO: apply filter state
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopFilter title="Board" issues={issues} hideSort={true} />
      <IssueBoard issues={issues} />
    </div>
  );
}

export default Board;
