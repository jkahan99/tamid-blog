// pages/MyPosts.jsx
// The "My Posts" page — only accessible when logged in.
// Users can see all their posts (public AND private), create new ones,
// edit existing ones, and delete them.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, createPost, updatePost, deletePost } from "../api";
import { useAuth } from "../context/AuthContext";
import BlogCard from "../components/BlogCard";
import PostForm from "../components/PostForm";

export default function MyPosts() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // All posts belonging to the current user
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Controls which "panel" is visible:
  // null = just the list, "create" = new post form, "edit" = edit form
  const [mode, setMode] = useState(null);

  // When editing, this holds the post being edited
  const [editingPost, setEditingPost] = useState(null);

  // Tracks if a save operation is in progress (to disable the submit button)
  const [saving, setSaving] = useState(false);

  // If the user isn't logged in, send them to the login page
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyPosts();
  }, [user]);

  // Load all public posts and filter by the current user's ID.
  // Note: The API doesn't have a "my posts" endpoint, so we fetch all posts
  // and filter client-side by author_id. This also works for public posts only —
  // private posts from the user won't appear here (backend limitation).
  // If you add a GET /posts/mine endpoint to the backend, update this function.
  async function fetchMyPosts() {
    setLoading(true);
    setError("");
    try {
      // The backend filters by author name, but we need to filter by user ID.
      // We fetch all posts and filter here — simple and clear.
      const allPosts = await getPosts();
      // Keep only posts authored by the current logged-in user
      const mine = allPosts.filter(
        (post) => String(post.author_id) === String(user.id)
      );
      setPosts(mine);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Called when the PostForm is submitted in "create" mode
  async function handleCreate(formData) {
    setSaving(true);
    try {
      await createPost(formData);
      setMode(null); // Close the form
      fetchMyPosts(); // Refresh the list
    } catch (err) {
      alert("Error creating post: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  // Called when the PostForm is submitted in "edit" mode
  async function handleUpdate(formData) {
    setSaving(true);
    try {
      await updatePost(editingPost.id, formData);
      setMode(null);
      setEditingPost(null);
      fetchMyPosts(); // Refresh so the updated post shows up
    } catch (err) {
      alert("Error updating post: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  // Called when the user confirms deletion from a BlogCard
  async function handleDelete(postId) {
    try {
      await deletePost(postId);
      // Remove the deleted post from state immediately — no need to refetch
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      alert("Error deleting post: " + err.message);
    }
  }

  // Open the edit form pre-filled with the post's current data
  function handleEdit(post) {
    setEditingPost(post);
    setMode("edit");
    // Scroll to the top so the form is visible
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Close whatever form is open and reset state
  function handleCancel() {
    setMode(null);
    setEditingPost(null);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Posts</h1>
        <p className="page-subtitle">Manage your own blog posts</p>
      </div>

      {/* ── Create / Edit Form ────────────────────────────────────────── */}
      {mode === "create" && (
        <div className="form-panel">
          <h2>Create a New Post</h2>
          <PostForm
            onSubmit={handleCreate}
            onCancel={handleCancel}
            isLoading={saving}
          />
        </div>
      )}

      {mode === "edit" && editingPost && (
        <div className="form-panel">
          <h2>Edit Post</h2>
          <PostForm
            initialData={editingPost}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
            isLoading={saving}
          />
        </div>
      )}

      {/* ── "New Post" button — only shown when no form is open ──────── */}
      {mode === null && (
        <button
          className="btn-primary btn-new-post"
          onClick={() => setMode("create")}
        >
          + New Post
        </button>
      )}

      {/* ── Post List ─────────────────────────────────────────────────── */}
      {loading && <p className="status-msg">Loading your posts...</p>}
      {error && <p className="status-msg error">{error}</p>}

      {!loading && !error && posts.length === 0 && mode !== "create" && (
        <p className="status-msg">
          You haven't written any posts yet. Click "New Post" to get started!
        </p>
      )}

      <div className="posts-grid">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            showActions={true} // Show Edit and Delete buttons
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
