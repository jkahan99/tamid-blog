// pages/Home.jsx
// The public home page. Shows all public posts and lets users search/filter them.
// Anyone can view this page — no login required.

import { useState, useEffect } from "react";
import { getPosts } from "../api";
import BlogCard from "../components/BlogCard";

export default function Home() {
  // The list of posts loaded from the backend
  const [posts, setPosts] = useState([]);

  // Loading and error states for better UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search/filter field values — these are sent as query params to the API
  const [titleSearch, setTitleSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  // Fetch posts whenever the component mounts for the first time
  useEffect(() => {
    fetchPosts();
  }, []);

  // Load posts from the backend with optional filters
  async function fetchPosts(filters = {}) {
    setLoading(true);
    setError("");
    try {
      const data = await getPosts(filters);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Called when the user clicks the "Search" button
  function handleSearch(e) {
    e.preventDefault();
    // Only send non-empty filters to the API
    fetchPosts({
      title: titleSearch || undefined,
      author: authorSearch || undefined,
      tag: tagSearch || undefined,
    });
  }

  // Clear all filters and reload all posts
  function handleClear() {
    setTitleSearch("");
    setAuthorSearch("");
    setTagSearch("");
    fetchPosts();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Explore Posts</h1>
        <p className="page-subtitle">Read what the TAMID community is writing about</p>
      </div>

      {/* ── Search & Filter Panel ─────────────────────────────────────── */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          value={titleSearch}
          onChange={(e) => setTitleSearch(e.target.value)}
          placeholder="Search by title..."
          className="search-input"
        />
        <input
          type="text"
          value={authorSearch}
          onChange={(e) => setAuthorSearch(e.target.value)}
          placeholder="Search by author..."
          className="search-input"
        />
        <input
          type="text"
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          placeholder="Filter by tag..."
          className="search-input"
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
        <button type="button" className="btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </form>

      {/* ── Posts Feed ────────────────────────────────────────────────── */}
      {loading && <p className="status-msg">Loading posts...</p>}
      {error && <p className="status-msg error">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="status-msg">No posts found. Try different search terms.</p>
      )}

      <div className="posts-grid">
        {posts.map((post) => (
          // No edit/delete actions on the home page — just reading
          <BlogCard key={post.id} post={post} showActions={false} />
        ))}
      </div>
    </div>
  );
}
