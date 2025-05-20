import { getEmbeddings } from "./embedding";
import { pc } from "./pinecone";
import { convertToASCII } from "./utils";

export async function getMatchesFromEmbeddings(
	embeddings: number[],
	fileKey: string
) {
	const index = pc.Index(process.env.PINECONE_INDEX_NAME as string);

	try {
		const namespace = convertToASCII(fileKey);

		const queryResult = await index.namespace(namespace).query({
			vector: embeddings,
			topK: 5,
			includeMetadata: true
		});

		return queryResult.matches || [];
	} catch (err) {
		console.log("Error querying embeddings", err);
		throw err;
	}
}

export async function getContext(query: string, fileKey: string) {
	const queryEmbeddings = await getEmbeddings(query);

	const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

	const qualifyingDocs = matches.filter(
		(match) => match.score && match.score > 0.7
	);

	type Metadata = {
		text: string;
		pageNumber: number;
	};

	const context = qualifyingDocs.map(
		(match) => (match.metadata as Metadata).text
	);

	// 5 vectors
	return context.join("\n").substring(0, 3000);
}
