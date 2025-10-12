import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

interface CreateProject {
    name: string;
    description: string;
    status: string;
    dueDate: string;
}

export async function POST(req: Request) {
    try {
        const { name, description, status, dueDate }: CreateProject = await req.json();

        if (!name) {
            return NextResponse.json({ message: "Data is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("pm");

        const projectsCollection = db.collection("projects");

        // Create the project document
        const newProject = {
            name,
            description,
            status,
            dueDate: dueDate ? new Date(dueDate) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Insert into MongoDB
        const result = await projectsCollection.insertOne(newProject);

        return NextResponse.json({ message: "Project created!" }, { status: 200 });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
