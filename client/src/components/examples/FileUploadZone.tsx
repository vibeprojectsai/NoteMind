import { FileUploadZone } from "../FileUploadZone";

export default function FileUploadZoneExample() {
  return (
    <FileUploadZone
      onFileUpload={(file, content) => console.log("File uploaded:", file.name, content.substring(0, 100))}
      isLoading={false}
    />
  );
}
