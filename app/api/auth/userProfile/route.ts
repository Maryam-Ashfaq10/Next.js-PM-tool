import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    const client = await clientPromise;
    const db = client.db("pm");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(payload.id) }, { projection: { password: 0 } });

    console.log('user profile', user);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role ?? "User",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("me error:", err);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string };

    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pm");

    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(payload.id) },
      {
        $set: {
          name,
          email,
        },
      },
      { returnDocument: "after", projection: { password: 0 } }
    );

    if (!result) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = result;

    return NextResponse.json(
      {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role ?? "User",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("update profile error:", err);
    return NextResponse.json({ message: "Invalid token or update failed" }, { status: 400 });
  }
}