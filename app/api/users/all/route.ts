import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pm");

    const users = await db.collection("users")
      .find({}, { projection: { name: 1, email: 1 } })
      .toArray();

    const formatted = users.map((u: any) => ({
      id: u._id.toString(),
      name: u.name ?? "",
      email: u.email ?? "",
    }));
console.log(formatted);
    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}