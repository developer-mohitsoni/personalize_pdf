# Build AI PDF

## Description

This project, named "build-ai-pdf", is a Next.js application that allows users to interact with PDF documents using AI. It includes features such as chat, subscription management, and file upload.

## Key Features

*   **Chat Interface:** Allows users to chat with AI about the content of uploaded PDFs.
*   **Subscription Management:** Enables users to manage their subscriptions.
*   **File Upload:** Provides functionality for users to upload PDF files.
*   **PDF Viewer:** Displays PDF documents within the application.
*   **Razorpay Integration:** Handles payment processing via Razorpay.
*   **Database:** Uses Drizzle ORM to interact with a database.
*   **Pinecone Integration:** Uses Pinecone for vector embeddings.
*   **AWS S3 Integration:** Uses AWS S3 for file storage.

## Tech Stack

*   **Next.js:** A React framework for building web applications.
*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript.
*   **Tailwind CSS:** A utility-first CSS framework.
*   **Drizzle ORM:** A TypeScript ORM for interacting with databases.
*   **Pinecone:** A vector database for storing and querying embeddings.
*   **AWS S3:** A cloud storage service for storing files.
*   **Razorpay:** A payment gateway for processing payments.
*   **Clerk:** Authentication and user management.
*   **Langchain:** A framework for building applications powered by language models.
*   **OpenAI:** Used for AI functionalities.

## Dependencies

*   "@ai-sdk/openai": "^1.3.22"
*   "@ai-sdk/react": "^1.2.12"
*   "@aws-sdk/client-s3": "^3.808.0"
*   "@clerk/nextjs": "^6.19.2"
*   "@langchain/community": "^0.3.42"
*   "@langchain/core": "^0.3.55"
*   "@neondatabase/serverless": "^1.0.0"
*   "@pinecone-database/doc-splitter": "^0.0.1"
*   "@pinecone-database/pinecone": "^6.0.0"
*   "@radix-ui/react-slot": "^1.2.2"
*   "@tanstack/react-query": "^5.76.1"
*   "ai": "^4.3.16"
*   "aws-sdk": "^2.1692.0"
*   "axios": "^1.9.0"
*   "class-variance-authority": "^0.7.1"
*   "clsx": "^2.1.1"
*   "dotenv": "^16.5.0"
*   "drizzle-kit": "^0.31.1"
*   "drizzle-orm": "^0.43.1"
*   "langchain": "^0.3.25"
*   "lucide-react": "^0.510.0"
*   "md5": "^2.3.0"
*   "next": "15.3.2"
*   "openai-edge": "^1.2.2"
*   "pdf-parse": "^1.1.1"
*   "razorpay": "^2.9.6"
*   "react": "^19.0.0"
*   "react-dom": "^19.0.0"
*   "react-dropzone": "^14.3.8"
*   "react-hot-toast": "^2.5.2"
*   "stripe": "^18.1.1"
*   "tailwind-merge": "^3.3.0"

## Getting Started

### Prerequisites

*   Node.js (>=18)
*   npm or yarn
*   Neon Database
*   Pinecone Account
*   AWS S3 Bucket
*   Razorpay Account
*   Clerk Account

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd build-ai-pdf
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  Set up environment variables:

    Create a `.env` file in the root directory and add the following environment variables:

    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
    NEXT_BASE_URL=http://localhost:3000
    DATABASE_URL=your_database_url
    NEXT_PUBLIC_S3_BUCKET_NAME=your_bucket_name
    NEXT_PUBLIC_S3_REGION=your_bucket_region
    PINECONE_API_KEY=your_pinecone_api_key
    PINECONE_INDEX_NAME=your_pinecone_index_name
    S3_ACCESS_KEY_ID=your_aws_access_key_id
    S3_SECRET_ACCESS_KEY=your_aws_secret_access_key
    S3_BUCKET_NAME=your_aws_s3_bucket_name
    S3_REGION=your_aws_s3_region
    OPENAI_API_KEY=your_openai_api_key
    RAZORPAY_KEY_ID=your_razorpay_key_id
    PLAN_ID=your_plan_id
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
    ```

4.  Run database migrations:

    ```bash
    npx drizzle-kit generate:pg
    npx drizzle-kit push:pg
    ```

### Running the Application

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running with Docker

1.  **Build the Docker image:**

    ```bash
    docker build --no-cache --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_next_public_clerk_publishable_key -t build-ai-pdf .
    ```

2.  **Run the Docker container:**

    ```bash
    docker run -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_next_public_clerk_publishable_key -p 3000:3000 my-app-image build-ai-pdf
    ```

    This command starts the container and maps port 3000 to your local machine. It also passes the environment variables from your `.env` file to the container.

## Contributing

We welcome contributions to this project! Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Submit a pull request.

## License

[MIT](https://opensource.org/license/mit/)
