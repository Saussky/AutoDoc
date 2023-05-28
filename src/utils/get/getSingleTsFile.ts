import axios from "axios";

export default async function getSingleTSFile(
  baseUrl: string,
  headers: any
): Promise<any | null> {
  try {
    const response = await axios.get(`${baseUrl}`, { headers });
    const content = response.data;

    if (content.type === "file" && content.name.endsWith(".ts")) {
      return content;
    } else {
      console.log("The specified file is not a TypeScript file.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching the file:", error);
    return null;
  }
}