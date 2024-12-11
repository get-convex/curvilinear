import TopFilter from "../../components/TopFilter";
import IssueBoard from "./IssueBoard";
import { useFilterState } from "../../utils/filterState";
import { Issue } from "../../types/types";

function Board() {
  const [_filterState] = useFilterState();
  // XXX: Load all issues here.
  const issues = [] as Issue[];
  // TODO: apply filter state
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopFilter title="Board" issues={issues} hideSort={true} />
      <IssueBoard issues={issues} />
    </div>
  );
}

export default Board;
