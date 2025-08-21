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
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Autarc Comments
          </h1>
          <p className="text-gray-300">
            Enhancing collaboration and communication
          </p>
        </header>

        {/* New comment form */}
        <section className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8 shadow-lg">
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
