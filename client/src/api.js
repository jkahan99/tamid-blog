// api.js
// This is the single file that handles ALL communication with our backend.
// Instead of writing fetch() calls scattered everywhere, we define them here
// and import them wherever we need them. Easy to find, easy to change.

const BASE_URL = "https://corsproxy.io/?http://tamid-blog-env.eba-sxszu2wa.us-east-2.elasticbeanstalk.com";// ─── AUTH HELPERS ────────────────────────────────────────────────────────────

// Save the JWT token to localStorage so the user stays logged in across page refreshes
export function saveToken(token) {
  localStorage.setItem("token", token);
}

// Get the token back out when we need to attach it to requests
export function getToken() {
  return localStorage.getItem("token");
}

// Remove the token — this is how we "log out"
export function removeToken() {
  localStorage.removeItem("token");
}

// Check if the user is currently logged in (token exists)
export function isLoggedIn() {
  return !!getToken();
}

// Build the Authorization header that protected routes require
function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── AUTH ENDPOINTS ───────────────────────────────────────────────────────────

// POST /auth/register — create a new account
// userData should be: { display_name, email, password }
export async function register(userData) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  // If the server returned an error (like "email already registered"), throw it
  if (!response.ok) {
    throw new Error(data.detail || "Registration failed");
  }

  return data; // Returns the new user object
}

// POST /auth/login — sign in and get a JWT token
// credentials should be: { email, password }
export async function login(credentials) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  // Save the token so future requests are authenticated
  saveToken(data.access_token);
  return data;
}

// ─── POST ENDPOINTS ───────────────────────────────────────────────────────────

// GET /posts — get all public posts, with optional filters
// filters is an object like: { tag: "Tech", author: "Joe", title: "React" }
export async function getPosts(filters = {}) {
  // Build query string from filters — only include non-empty values
  const params = new URLSearchParams();
  if (filters.tag) params.append("tag", filters.tag);
  if (filters.author) params.append("author", filters.author);
  if (filters.title) params.append("title", filters.title);

  const queryString = params.toString();
  const url = `${BASE_URL}/posts/${queryString ? "?" + queryString : ""}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load posts");
  }

  return data; // Returns array of post objects
}

// GET /posts/{id} — get one specific post by its ID
export async function getPost(postId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Post not found");
  }

  return data;
}

// POST /posts — create a new post (must be logged in)
// postData should be: { title, content, is_public, tags, image_url }
export async function createPost(postData) {
  const response = await fetch(`${BASE_URL}/posts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(), // Attach the JWT token
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create post");
  }

  return data;
}

// PUT /posts/{id} — update an existing post (must be the author)
// postData can include any of: { title, content, is_public, tags, image_url }
export async function updatePost(postId, postData) {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update post");
  }

  return data;
}

// DELETE /posts/{id} — delete a post (must be the author)
export async function deletePost(postId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to delete post");
  }

  return data;
}
