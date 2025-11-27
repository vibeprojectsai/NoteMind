import pdf from "pdf-parse";
import * as pdfStar from "pdf-parse";

console.log("Default export type:", typeof pdf);
console.log("Star export keys:", Object.keys(pdfStar));

async function run() {
    try {
        const buffer = Buffer.from("test");
        // @ts-ignore
        const result = await pdf(buffer);
        console.log("Result:", result);
    } catch (e) {
        console.log("Error calling default:", e);
    }
}
run();
