import { PDFParse } from "pdf-parse";

async function test() {
    try {
        console.log("PDFParse imported:", PDFParse);
        const buffer = Buffer.from("test");
        const uint8Array = new Uint8Array(buffer);
        const parser = new PDFParse({ data: uint8Array });
        console.log("Parser created");
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
