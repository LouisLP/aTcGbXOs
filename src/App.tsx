import { useComments } from "./hooks/useComments";
import { CommentForm } from "./components/CommentForm";
import { CommentList } from "./components/CommentList";
import { AutarcLogo } from "./components/svgs/AutarcLogo";

function App() {
  const { comments, loading, error, addComment, deleteComment, refetch } =
    useComments();

  const handleAddComment = (text: string) => {
    addComment(text);
  };

  const handleReply = (text: string, parentId: string) => {
    addComment(text, parentId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 bg-linear-to-b from-blue-900/20 to-purple-800/20 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="flex justify-center items-center p-6 rounded-lg">
          <AutarcLogo width={200} height={200} className="text-gray-100" />
        </header>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={refetch}
              className="text-red-200 hover:text-white underline ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* New comment form */}
        <section className="bg-gray-800/40 backdrop-blur-2xl rounded-lg border border-gray-700/40 p-6 mb-8 shadow-lg">
          <CommentForm onSubmit={handleAddComment} />
        </section>

        {/* Comments list */}
        <section>
          <CommentList
            comments={comments}
            onReply={handleReply}
            onDelete={deleteComment}
          />
        </section>
      </div>
    </div>
  );
}

export default App;
