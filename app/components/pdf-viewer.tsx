"use client";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PdfViewerProps {
  url: string;
  className?: string;
}

const PdfViewer = ({ url, className } : PdfViewerProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <div className={className}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
        <Viewer
          fileUrl={url}
          plugins={[defaultLayoutPluginInstance]}
          enableSmoothScroll={true}
          theme="light"
          defaultScale={2}
        />
      </Worker>
    </div>
  );
};
export default PdfViewer;