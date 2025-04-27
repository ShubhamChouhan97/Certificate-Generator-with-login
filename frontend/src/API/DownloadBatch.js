export const DownloadBatch = async (id) => {
  const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

  const response = await fetch(`${API_URL}/download/batchpath`, {
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

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${id}.zip`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  alert("Download Successfuly");
};
