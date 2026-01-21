import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

type ChartDataPoint = {
  label: string;
  value: number;
  category?: string;
};

// Escapes a CSV field by doubling quotes and wrapping if needed
const escapeCsvField = (text: string): string => {
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
};

export const exportToCSV = async (
  data: ChartDataPoint[],
  filename: string = "water_test_results"
): Promise<void> => {
  try {
    // Create CSV content
    const headers = ["Label", "Value", "Category"];
    const csvRows = [headers.join(",")];

    data.forEach((point) => {
      const row = [
        escapeCsvField(point.label),
        point.value.toString(),
        point.category ? escapeCsvField(point.category) : "",
      ];
      csvRows.push(row.join(","));
    });

    // Add UTF-8 BOM for Excel compatibility
    const csvContent = "\uFEFF" + csvRows.join("\n");

    // Create file in app's document directory
    const timestamp = new Date()
      .toISOString()
      .replace(/[:T]/g, "-")
      .replace(/\..+$/, "");
    const safeBase = filename.replace(/[^a-zA-Z0-9-_]/g, "_");
    const fileName = `${safeBase}_${timestamp}.csv`;
    const file = new FileSystem.File(FileSystem.Paths.document, fileName);
    file.write(csvContent, { encoding: "utf8" });
    const fileUri = file.uri;

    // Share file if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        UTI: "public.comma-separated-values-text",
        dialogTitle: "Export CSV",
      });
    } else {
      console.log("File saved to:", fileUri);
    }
  } catch (error) {
    console.error("Error exporting CSV:", error);
    throw error;
  }
};

