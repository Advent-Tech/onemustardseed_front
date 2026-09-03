import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { mediaUrl } from "@/lib/api";

export const Route = createFileRoute("/api/resources/files/$fileId")({
  component: ApiResourceFileRedirect,
});

function ApiResourceFileRedirect() {
  const { fileId } = Route.useParams();
  const downloadUrl = mediaUrl(`/api/resources/files/${fileId}`);

  useEffect(() => {
    if (fileId) {
      window.location.replace(downloadUrl);
    }
  }, [fileId, downloadUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF7EE] text-forest-deep p-6">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="text-xl font-bold font-display">Preparing your download...</h2>
      <p className="text-muted-foreground text-sm mt-2">
        If your download does not begin automatically,{" "}
        <a
          href={downloadUrl}
          className="text-forest underline font-bold"
        >
          click here to download directly
        </a>
        .
      </p>
    </div>
  );
}
