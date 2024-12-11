import TopFilter from "../../components/TopFilter";
import IssueList from "./IssueList";
import { useFilterState } from "../../utils/filterState";
import { Issue, Priority, Status } from "../../types/types";

function List({ showSearch = false }) {
  const [filterState] = useFilterState();

  // XXX: Load all issues here.
  const defaultIssues: Issue[] = [
    {
      id: "1",
      title: "Implement user authentication",
      description: "Add login and signup functionality with JWT tokens",
      priority: Priority.HIGH,
      status: Status.TODO,
      modified: new Date(),
      created: new Date(),
      kanbanorder: "1",
      username: "john.doe",
    },
    {
      id: "2",
      title: "Fix navigation bug",
      description: "Menu items not highlighting correctly on mobile view",
      priority: Priority.URGENT,
      status: Status.IN_PROGRESS,
      modified: new Date(),
      created: new Date(),
      kanbanorder: "2",
      username: "jane.smith",
    },
    {
      id: "3",
      title: "Update documentation",
      description: "Add API endpoints documentation and usage examples",
      priority: Priority.LOW,
      status: Status.BACKLOG,
      modified: new Date(),
      created: new Date(),
      kanbanorder: "3",
      username: "alex.wilson",
    },
    {
      id: "4",
      title: "Optimize database queries",
      description: "Improve performance of main dashboard queries",
      priority: Priority.MEDIUM,
      status: Status.DONE,
      modified: new Date(),
      created: new Date(),
      kanbanorder: "4",
      username: "sarah.parker",
    },
    {
      id: "5",
      title: "Design system update",
      description: "Update component library to match new brand guidelines",
      priority: Priority.NONE,
      status: Status.CANCELED,
      modified: new Date(),
      created: new Date(),
      kanbanorder: "5",
      username: "mike.brown",
    },
  ];

  const issues = defaultIssues;

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
