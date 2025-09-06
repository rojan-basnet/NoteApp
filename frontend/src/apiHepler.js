let accessToken = localStorage.getItem("userToken");
let refreshToken = localStorage.getItem("refreshToken");

async function refreshAccessToken() {
  const res = await fetch(`${import.meta.env.VITE_FETCH_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error("Refresh failed, please login again");
  }

  const data = await res.json();
  accessToken = data.accessToken;
  localStorage.setItem("userToken", accessToken);
  return accessToken;
}

// Monkey patch fetch
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  options.headers = options.headers || {};
  options.headers["Authorization"] = `Bearer ${accessToken}`;

  let response = await originalFetch(url, options);

  if (response.status === 403) {
    try {
      const newToken = await refreshAccessToken();
      options.headers["Authorization"] = `Bearer ${newToken}`;
      response = await originalFetch(url, options);
    } catch (err) {
      console.error("Refresh token invalid, redirecting to login...");
      window.location.href = "/loginPage";
    }
  }

  return response;
};
