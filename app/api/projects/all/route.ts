import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {

    try {

        const client = await clientPromise;
        const db = client.db("pm");

        const projectsCollection = db.collection("projects");

        // Fetch all documents
        const projectsAll = await projectsCollection.find({}).toArray();

        // Return response as JSON
        return new Response(JSON.stringify(projectsAll), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in fetching all projects:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }

}