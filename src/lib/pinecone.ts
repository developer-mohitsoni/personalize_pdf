import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
	Document,
	RecursiveCharacterTextSplitter
} from "@pinecone-database/doc-splitter";
import { Pinecone } from "@pinecone-database/pinecone";
import type { PineconeRecord } from "@pinecone-database/pinecone";
import md5 from "md5";
import { getEmbeddings } from "./embedding";
import { downloadFromS3 } from "./s3-server";
import { convertToASCII } from "./utils";

export function getPineconeClient(): Pinecone {
	let pc: Pinecone | null = null;

	if (pc) return pc;

	const apiKey = process.env.PINECONE_API_KEY;
	if (!apiKey) {
		throw new Error("Missing PINECONE_API_KEY");
	}

	pc = new Pinecone({ apiKey });
	return pc;
}

type PDFPage = {
	pageContent: string;
	metadata: {
		loc: {
			pageNumber: number;
		};
	};
};

export async function loadS3IntoPinecone(file_key: string) {
	const pc = getPineconeClient();
	// 1. Obtain the PDF -> Download and Read from PDF
	console.log("Downloading S3 into file system");

	const file_name = await downloadFromS3(file_key);

	if (!file_name) {
		throw new Error("could not download file from S3");
	}

	const loader = new PDFLoader(file_name);

	const pages = (await loader.load()) as PDFPage[];

	// 2. Split and Segment the PDF into smaller documents
	const documents = await Promise.all(pages.map(prepareDocument));

	// 3. Vectorise and Embeded individual documents
	const vectors: PineconeRecord<Record<string, any>>[] = await Promise.all(
		documents.flat().map(embedDocuments)
	);

	// 4. Upsert the vectors into Pinecone
	const pineconeIndex = pc.Index(process.env.PINECONE_INDEX_NAME as string);

	console.log("Inserting Vectors into Pinecone");

	const namespace = convertToASCII(file_key);

	await pineconeIndex.namespace(namespace).upsert(vectors);

	return documents[0];
}

async function embedDocuments(docs: Document) {
	try {
		const embedding = await getEmbeddings(docs.pageContent);

		const hash = md5(docs.pageContent);

		return {
			id: hash,
			values: embedding,
			metadata: {
				text: String(docs.metadata.text),
				pageNumber: String(docs.metadata.pageNumber)
			}
		} as PineconeRecord<Record<string, any>>;
	} catch (err) {
		console.error("error embedding documents", err);

		throw err;
	}
}

export const truncateStringByBytes = (str: string, bytes: number) => {
	const encoder = new TextEncoder();

	return new TextDecoder("utf-8").decode(encoder.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
	const { pageContent, metadata } = page;

	pageContent.replace(/\n/g, " ");

	// Split the docs

	const splitter = new RecursiveCharacterTextSplitter();
	const docs = await splitter.splitDocuments([
		new Document({
			pageContent,
			metadata: {
				pageNumber: metadata.loc.pageNumber,
				text: truncateStringByBytes(pageContent, 36000)
			}
		})
	]);

	return docs;
}
