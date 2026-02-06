import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface ProjectUpdateBody {
    name?: string;
    description?: string;
    status?: string;
    dueDate?: string;
  }

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const client = await clientPromise;
        const db = client.db("pm");
        const projectsCollection = db.collection("projects");

        const project = await projectsCollection.findOne({ _id: new ObjectId(params.id) });

        if (!project) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(project, { status: 200 });

    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }

}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const body: ProjectUpdateBody = await req.json();
  
      const client = await clientPromise;
      const db = client.db("pm");
      const projectsCollection = db.collection("projects");
  
      const updated = await projectsCollection.findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        {
          $set: {
            name: body.name,
            description: body.description,
            status: body.status,
            dueDate: body.dueDate,
          },
        },
        { returnDocument: "after" }
      );
  
      if (!updated) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }
  
     // const result = { ...updated, id: updated._id.toString() };
  
      return NextResponse.json(updated, { status: 200 });
    } catch (error) {
      console.error("Error updating project:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }