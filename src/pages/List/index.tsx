import TopFilter from "../../components/TopFilter";
import IssueList from "./IssueList";
import { useFilterState } from "../../utils/filterState";
import { Issue } from "../../types/types";
import { loadAllIssues } from "@/local/queries";
import { useLocalQuery } from "local-store/react/hooks";

function List({ showSearch = false }) {
  const [filterState] = useFilterState();
  const issues: Issue[] = useLocalQuery(loadAllIssues, {}) ?? [];
  const filteredIssues = issues.filter((issue) => {
    const tests = [true];
    if (filterState.priority && filterState.priority.length > 0) {
      tests.push(filterState.priority.includes(issue.priority));
    }
    if (filterState.status && filterState.status.length > 0) {
      tests.push(filterState.status.includes(issue.status));
    }

    if (typeof filterState.query !== `undefined`) {
      tests.push(issue.title.includes(filterState.query));
    }

    // Return true only if all tests are true
    return tests.every((test) => test);
  });

  return (
    <div className="flex flex-col flex-grow">
      <TopFilter issues={filteredIssues} showSearch={showSearch} />
      <IssueList issues={filteredIssues} />
    </div>
  );
}

export default List;
