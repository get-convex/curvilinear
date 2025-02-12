import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { BsTrash3 as DeleteIcon } from "react-icons/bs";
import { BsXLg as CloseIcon } from "react-icons/bs";
import PriorityMenu from "../../components/contextmenu/PriorityMenu";
import StatusMenu from "../../components/contextmenu/StatusMenu";
import PriorityIcon from "../../components/PriorityIcon";
import StatusIcon from "../../components/StatusIcon";
import Avatar from "../../components/Avatar";
import { Issue, PriorityDisplay, StatusDisplay } from "../../types/types";
import Editor from "../../components/editor/Editor";
import DeleteModal from "./DeleteModal";
import Comments from "./Comments";
import debounce from "lodash.debounce";
import { useLocalStoreClient } from "local-store/react/LocalStoreProvider";
import { loadAllIssues } from "@/local/queries";
import { useLocalQuery } from "local-store/react/hooks";
import {
  changeDescription,
  changePriority,
  changeStatus,
  changeTitle,
  deleteIssue,
} from "@/local/mutations";

// XXX: Find a way to remove debouncing.
const debounceTime = 500;

function IssuePage() {
  const navigate = useNavigate();
  const client = useLocalStoreClient();
  const issues: Issue[] | undefined = useLocalQuery(
    loadAllIssues,
    {},
    "loadAllIssues",
  );
  const params = useParams();

  let issue = issues?.find((i) => i.id === params.id);

  // XXX: Remove this hack once we fix updates & deletes.
  const lastIssue = useRef(issue);
  if (!issue) {
    issue = lastIssue.current;
  } else {
    lastIssue.current = issue;
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [dirtyTitle, setDirtyTitle] = useState<string | null>(null);
  const titleIsDirty = useRef(false);
  const [dirtyDescription, setDirtyDescription] = useState<string | null>(null);
  const descriptionIsDirty = useRef(false);

  if (issues === undefined) {
    return <div className="p-8 w-full text-center">Loading...</div>;
  } else if (!issue) {
    return <div className="p-8 w-full text-center">Issue not found</div>;
  }

  // We check if the dirty title or description is the same as the actual title or
  // description, and if so, we can switch back to the non-dirty version
  if (dirtyTitle === issue.title) {
    setDirtyTitle(null);
    titleIsDirty.current = false;
  }
  if (dirtyDescription === issue.description) {
    setDirtyDescription(null);
    descriptionIsDirty.current = false;
  }

  const handleStatusChange = async (status: any) => {
    const args = {
      id: issue.id,
      status,
    };
    await client.mutation(changeStatus, args);
  };

  const handlePriorityChange = async (priority: string) => {
    const args = {
      id: issue.id,
      priority,
    };
    await client.mutation(changePriority, args);
  };

  const handleTitleChangeDebounced = debounce(async (title: string) => {
    const args = {
      id: issue.id,
      title,
    };
    await client.mutation(changeTitle, args);
  }, debounceTime);

  const handleTitleChange = (title: string) => {
    setDirtyTitle(title);
    titleIsDirty.current = true;
    // We debounce the title change so that we don't spam the db with updates
    handleTitleChangeDebounced(title);
  };

  const handleDescriptionChangeDebounced = debounce(
    async (description: string) => {
      const args = {
        id: issue.id,
        description,
      };
      await client.mutation(changeDescription, args);
    },
    debounceTime,
  );

  const handleDescriptionChange = (description: string) => {
    setDirtyDescription(description);
    descriptionIsDirty.current = true;
    // We debounce the description change so that we don't spam the db with updates
    handleDescriptionChangeDebounced(description);
  };

  const handleDelete = async () => {
    const args = {
      id: issue.id,
    };
    const promise = client.mutation(deleteIssue, args);
    handleClose();
    await promise;
  };

  const handleClose = () => {
    if (window.history.length > 2) {
      navigate(-1);
    }
    navigate(`/`);
  };

  const shortId = () => {
    if (issue.id.includes(`-`)) {
      return issue.id.slice(issue.id.length - 8);
    } else {
      return issue.id;
    }
  };

  return (
    <>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-col">
          <div className="flex justify-between flex-shrink-0 pr-6 border-b border-gray-200 h-14 pl-3 md:pl-5 lg:pl-9">
            <div className="flex items-center">
              <span className="font-semibold me-2">Issue</span>
              <span className="text-gray-500" title={issue.id}>
                {shortId()}
              </span>
            </div>

            <div className="flex items-center">
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setShowDeleteModal(true)}
              >
                <DeleteIcon size={14} />
              </button>
              <button
                className="ms-2 p-2 rounded hover:bg-gray-100"
                onClick={handleClose}
              >
                <CloseIcon size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* <div className="flex flex-col overflow-auto">issue info</div> */}
        <div className="flex flex-1 p-3 md:p-2 overflow-hidden flex-col md:flex-row">
          <div className="md:block flex md:flex-[1_0_0] min-w-0 md:p-3 md:order-2">
            <div className="max-w-4xl flex flex-row md:flex-col">
              <div className="flex flex-1 mb-3 mr-5 md-mr-0">
                <div className="flex flex-[2_0_0] mr-2 md-mr-0 items-center">
                  Opened by
                </div>
                <div className="flex flex-[3_0_0]">
                  <button className="inline-flex items-center h-6 ps-1.5 pe-2 text-gray-500 border-none rounded hover:bg-gray-100">
                    <Avatar name={issue.username} />
                    <span className="ml-1 whitespace-nowrap">
                      {issue.username}
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex flex-1 mb-3 mr-5 md-mr-0">
                <div className="flex flex-[2_0_0] mr-2 md-mr-0 items-center">
                  Status
                </div>
                <div className="flex flex-[3_0_0]">
                  <StatusMenu
                    id={`issue-status-` + issue.id}
                    button={
                      <button className="inline-flex items-center h-6 px-2 text-gray-500 border-none rounded hover:bg-gray-100">
                        <StatusIcon status={issue.status} className="mr-1" />
                        <span>{StatusDisplay[issue.status]}</span>
                      </button>
                    }
                    onSelect={handleStatusChange}
                  />
                </div>
              </div>
              <div className="flex flex-1 mb-3 mr-5 md-mr-0">
                <div className="flex flex-[2_0_0] mr-2 md-mr-0 items-center">
                  Priority
                </div>
                <div className="flex flex-[3_0_0]">
                  <PriorityMenu
                    id={`issue-priority-` + issue.id}
                    button={
                      <button className="inline-flex items-center h-6 px-2 text-gray-500 border-none rounded hover:bg-gray-100 hover:text-gray-700">
                        <PriorityIcon
                          priority={issue.priority}
                          className="mr-1"
                        />
                        <span>{PriorityDisplay[issue.priority]}</span>
                      </button>
                    }
                    onSelect={handlePriorityChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-[3_0_0] md:p-3 border-gray-200 md:border-r min-h-0 min-w-0 overflow-auto">
            <input
              className="w-full px-3 py-1 text-lg font-semibold placeholder-gray-400 border-transparent rounded "
              placeholder="Issue title"
              value={titleIsDirty.current ? dirtyTitle! : issue.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />

            <div className="w-full max-w-full mt-2 min-h-fit p-3 ">
              <Editor
                className="prose font-normal appearance-none text-md rounded editor"
                value={
                  descriptionIsDirty.current
                    ? dirtyDescription || ``
                    : issue.description || ``
                }
                onChange={(val) => handleDescriptionChange(val)}
                placeholder="Add description..."
              />
            </div>
            <div className="border-t border-gray-200 mt-3 p-3">
              <h2 className="text-md mb-3">Comments</h2>
              <Comments issue={issue} />
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        deleteIssue={handleDelete}
      />
    </>
  );
}

export default IssuePage;
