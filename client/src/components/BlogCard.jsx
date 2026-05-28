// components/BlogCard.jsx
// Displays a single blog post as a card in the feed.
// Used on both the Home page and the My Posts page.
//
// Props:
//   post     — the post object from the API
//   showActions — if true, show Edit/Delete buttons (used on My Posts page)
//   onDelete — callback function to call when delete is confirmed
//   onEdit   — callback function to call when edit is clicked

import { useState } from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ post, showActions = false, onDelete, onEdit }) {
  // Track whether the delete confirmation dialog is open
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Format the date nicely — e.g. "May 27, 2026"
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Show a short preview of the content instead of the whole thing
  const preview =
    post.content.length > 200
      ? post.content.slice(0, 200) + "..."
      : post.content;

  return (
    <div className="blog-card">
      {/* Optional header image */}
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="blog-card-image" />
      )}

      <div className="blog-card-body">
        {/* Post title */}
        <h2 className="blog-card-title">{post.title}</h2>

        {/* Author and date */}
        <p className="blog-card-meta">
          By <strong>{post.author_name}</strong> · {formattedDate}
          {/* Show a "Private" badge on My Posts page for private posts */}
          {!post.is_public && (
            <span className="badge-private"> · 🔒 Private</span>
          )}
        </p>

        {/* Content preview */}
        <p className="blog-card-preview">{preview}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="blog-card-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons — only shown on My Posts page */}
        {showActions && (
          <div className="blog-card-actions">
            {/* Edit button */}
            <button
              className="btn-edit"
              onClick={() => onEdit(post)}
            >
              ✏️ Edit
            </button>

            {/* Delete button — shows confirmation first */}
            {!confirmingDelete ? (
              <button
                className="btn-delete"
                onClick={() => setConfirmingDelete(true)}
              >
                🗑️ Delete
              </button>
            ) : (
              // Confirmation step so users don't accidentally delete
              <span className="delete-confirm">
                Are you sure?{" "}
                <button
                  className="btn-delete-confirm"
                  onClick={() => {
                    onDelete(post.id);
                    setConfirmingDelete(false);
                  }}
                >
                  Yes, delete
                </button>{" "}
                <button
                  className="btn-cancel"
                  onClick={() => setConfirmingDelete(false)}
                >
                  Cancel
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
