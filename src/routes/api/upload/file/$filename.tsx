import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { mediaUrl } from "@/lib/api";

export const Route = createFileRoute("/api/upload/file/$filename")({
  component: ApiUploadFileRedirect,
});

function ApiUploadFileRedirect() {
  const { filename } = Route.useParams();
  const fileUrl = mediaUrl(`/api/upload/file/${filename}`);

  useEffect(() => {
    if (filename) {
      window.location.replace(fileUrl);
    }
  }, [filename, fileUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xs text-white/60">Redirecting to file...</p>
    </div>
  );
}
