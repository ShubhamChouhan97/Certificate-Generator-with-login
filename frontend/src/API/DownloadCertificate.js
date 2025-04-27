export const DownloadCertificate = async (id) => {
  const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

  const response = await fetch(`${API_URL}/download/certifiacte`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Download failed");
  }
// Convert response to blob
const blob = await response.blob();

// Create a download link
const url = window.URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;

// Use certificate id or something better as filename
link.setAttribute("download", `${id}.pdf`); // or .png/.jpg based on file type
document.body.appendChild(link);
link.click();
link.remove();

// Clean up
window.URL.revokeObjectURL(url);

  alert("Download started");
};
