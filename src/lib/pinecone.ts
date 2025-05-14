import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
	Pinecone,
	type PineconeConfiguration
} from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";

const config: PineconeConfiguration = {
	apiKey: process.env.PINECONE_API_KEY as string
};

const pc = new Pinecone(config);

export default pc;

export async function loadS3IntoPinecone(file_key: string) {
	// 1. Obtain the PDF -> Download and Read from PDF
	console.log("Downloading S3 into file system");

	const file_name = await downloadFromS3(file_key);

	if (!file_name) {
		throw new Error("could not download file from S3");
	}

	const loader = new PDFLoader(file_name);

	const pages = await loader.load();

	return pages;
}
