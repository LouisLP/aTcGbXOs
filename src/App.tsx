import { useComments } from "./hooks/useComments";
import { CommentForm } from "./components/CommentForm";
import { CommentList } from "./components/CommentList";

function App() {
  const { comments, addComment, deleteComment } = useComments();

  const handleAddComment = (text: string) => {
    addComment(text);
  };

  const handleReply = (text: string, parentId: string) => {
    addComment(text, parentId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Autarc Comments
          </h1>
          <p className="text-gray-600">
            Enhancing collaboration and communication
          </p>
        </div>

        {/* Add new comment form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add a Comment
          </h2>
          <CommentForm onSubmit={handleAddComment} />
        </div>

        {/* Comments list */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Comments ({comments.length})
          </h2>
          <CommentList
            comments={comments}
            onReply={handleReply}
            onDelete={deleteComment}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
