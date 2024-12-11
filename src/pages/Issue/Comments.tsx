import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Editor from "../../components/editor/Editor";
import Avatar from "../../components/Avatar";
import { formatDate } from "../../utils/date";
import { showWarning } from "../../utils/notification";
import { Comment, Issue } from "../../types/types";
import {
  useLocalStoreClient,
  useSyncQuery,
} from "local-store/react/LocalStoreProvider";
import { loadComments } from "@/queries";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";

export interface CommentsProps {
  issue: Issue;
}

function Comments(commentProps: CommentsProps) {
  const [newCommentBody, setNewCommentBody] = useState<string>(``);
  const { user } = useUser();

  const comments: Comment[] | undefined = useSyncQuery(
    loadComments,
    { issue_id: commentProps.issue.id },
    "loadComments",
  );
  console.log("comments", comments);

  const client = useLocalStoreClient();

  const commentList = () => {
    if (comments && comments.length > 0) {
      return comments.map((comment) => (
        <div
          key={comment.id}
          className="flex flex-col w-full p-3 mb-3 bg-white rounded shadow-sm border"
        >
          <div className="flex items-center mb-2">
            <Avatar name={comment.username} />
            <span className="ms-2 text-sm text-gray-400">
              {comment.username}
            </span>
            <span className=" ms-auto text-sm text-gray-400 ml-2">
              {formatDate(comment.created_at)}
            </span>
          </div>
          <div className="mt-2 text-md prose w-full max-w-full">
            <ReactMarkdown>{comment.body}</ReactMarkdown>
          </div>
        </div>
      ));
    }
  };

  const handlePost = async (event: any) => {
    event.preventDefault();
    if (!newCommentBody) {
      showWarning(
        `Please enter a comment before submitting`,
        `Comment required`,
      );
      return;
    }
    if (!user || !user.fullName) {
      showWarning(`Please login to post a comment`, `Login required`);
      return;
    }
    const args = {
      id: crypto.randomUUID(),
      issue_id: commentProps.issue.id,
      body: newCommentBody,
      created_at: Date.now(),
      username: user.fullName,
    };
    const promise = client.mutation(api.comments.postComment, args, args);
    setNewCommentBody("");
    await promise;
  };

  return (
    <>
      {commentList()}
      <form onSubmit={handlePost}>
        <div className="w-full max-w-full mt-2 min-h-14 ">
          <Editor
            className="prose font-normal p-3 appearance-none text-md shadow-sm rounded border border-gray-200 editor"
            value={newCommentBody}
            onChange={(val) => setNewCommentBody(val)}
            placeholder="Add a comment..."
          />
        </div>
        <div className="flex w-full py-3">
          <button
            className="px-3 ml-auto text-white bg-indigo-600 rounded hover:bg-indigo-700 h-7"
            onClick={handlePost}
            type="submit"
          >
            Post Comment
          </button>
        </div>
      </form>
    </>
  );
}

export default Comments;
