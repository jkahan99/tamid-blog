// components/PostForm.jsx
// A reusable form for both CREATING a new post and EDITING an existing one.
// The parent page passes in initial values (for edit) or leaves them blank (for create).
//
// Props:
//   initialData — optional, pre-fills the form when editing
//   onSubmit    — function called with the form data when the user submits
//   onCancel    — function called when the user clicks Cancel
//   isLoading   — disables the submit button while the API call is in progress

import { useState } from "react";

export default function PostForm({ initialData = {}, onSubmit, onCancel, isLoading }) {
  // Form field state — use initialData values if editing, otherwise start empty
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [isPublic, setIsPublic] = useState(
    initialData.is_public !== undefined ? initialData.is_public : true
  );
  const [imageUrl, setImageUrl] = useState(initialData.image_url || "");

  // Tags are stored as a comma-separated string in the input,
  // but sent as an array to the API
  const [tagsInput, setTagsInput] = useState(
    initialData.tags ? initialData.tags.join(", ") : ""
  );

  // Show any validation errors (e.g. empty title)
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // Prevent default browser form submission

    // Simple validation
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    // Parse tags: "Tech, Finance, Sports" → ["Tech", "Finance", "Sports"]
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0); // Remove any empty strings

    // Call the parent's onSubmit with the clean data
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      is_public: isPublic,
      image_url: imageUrl.trim() || null, // Send null if empty
      tags,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="post-form">
      {/* Show error message if validation failed */}
      {error && <p className="form-error">{error}</p>}

      {/* Title field */}
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your post a title..."
          className="form-input"
        />
      </div>

      {/* Content field — big textarea */}
      <div className="form-group">
        <label htmlFor="content">Content *</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post here..."
          className="form-textarea"
          rows={10}
        />
      </div>

      {/* Tags field — comma separated */}
      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g. Tech, Finance, Sports"
          className="form-input"
        />
        <small className="form-hint">Separate tags with commas</small>
      </div>

      {/* Image URL field — optional */}
      <div className="form-group">
        <label htmlFor="imageUrl">Image URL (optional)</label>
        <input
          id="imageUrl"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          className="form-input"
        />
      </div>

      {/* Public / Private toggle */}
      <div className="form-group form-group-checkbox">
        <input
          id="isPublic"
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <label htmlFor="isPublic">Make this post public</label>
      </div>

      {/* Submit and Cancel buttons */}
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Post"}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
