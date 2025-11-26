import { Header } from "../Header";

export default function HeaderExample() {
  return (
    <Header
      onExportPdf={() => console.log("Export PDF clicked")}
      isExporting={false}
      canExport={true}
    />
  );
}
