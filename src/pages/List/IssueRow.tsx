import type { CSSProperties } from "react";
import PriorityMenu from "../../components/contextmenu/PriorityMenu";
import StatusMenu from "../../components/contextmenu/StatusMenu";
import PriorityIcon from "../../components/PriorityIcon";
import StatusIcon from "../../components/StatusIcon";
import Avatar from "../../components/Avatar";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date";
import { Issue } from "../../types/types";
import { useLocalStoreClient } from "local-store/react/LocalStoreProvider";
import { changePriority, changeStatus } from "@/local/mutations";

interface Props {
  issue: Issue;
  style: CSSProperties;
}

function IssueRow({ issue, style }: Props) {
  const navigate = useNavigate();
  const client = useLocalStoreClient();

  const handleChangeStatus = async (status: string) => {
    const args = {
      id: issue.id,
      status,
    };
    await client.mutation(changeStatus, args);
  };

  const handleChangePriority = async (priority: string) => {
    const args = {
      id: issue.id,
      priority,
    };
    await client.mutation(changePriority, args);
  };

  return (
    <div
      key={issue.id}
      className="flex items-center flex-grow w-full min-w-0 pl-2 pr-8 text-sm border-b border-gray-100 hover:bg-gray-100 h-11 shrink-0"
      id={issue.id}
      onClick={() => navigate(`/issue/${issue.id}`)}
      style={style}
    >
      <div className="flex-shrink-0 ml-4">
        <PriorityMenu
          id={`r-priority-` + issue.id}
          button={<PriorityIcon priority={issue.priority} />}
          onSelect={handleChangePriority}
        />
      </div>
      <div className="flex-shrink-0 ml-3">
        <StatusMenu
          id={`r-status-` + issue.id}
          button={<StatusIcon status={issue.status} />}
          onSelect={handleChangeStatus as any}
        />
      </div>
      <div className="flex-wrap flex-shrink ml-3 overflow-hidden font-medium line-clamp-1 overflow-ellipsis">
        {issue.title.slice(0, 3000) || ``}
      </div>
      <div className="flex-shrink-0 hidden w-15 ml-auto font-normal text-gray-500 sm:block whitespace-nowrap">
        {formatDate(new Date(issue.created))}
      </div>
      <div className="flex-shrink-0 hidden ml-4 font-normal text-gray-500 sm:block w-15 md:block">
        <Avatar name={issue.username} />
      </div>
    </div>
  );
}

export default memo(IssueRow);
