import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

const STATUSES = ["todo", "inprogress", "uat", "prod", "completed"] as const;

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export async function GET() {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };
    const userId = String(payload.id);

    const client = await clientPromise;
    const db = client.db("pm");

    
    const projects = await db
      .collection("projects")
      .find({ assigneeId: userId })
      .toArray();

    const now = new Date();
    const todayStart = startOfDay(now);
    const weekEnd = endOfDay(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));

    let inProgress = 0;
    let completed = 0;
    let dueThisWeek = 0;
    let overdue = 0;

    const statusCounts: Record<string, number> = Object.fromEntries(
      STATUSES.map((s) => [s, 0])
    );

    for (const p of projects) {
      const status = p.status ?? "todo";
      if (statusCounts[status] !== undefined) statusCounts[status]++;
      else statusCounts[status] = (statusCounts[status] ?? 0) + 1;

      if (status === "inprogress") inProgress++;
      if (status === "completed") completed++;

      const due = p.dueDate ? new Date(p.dueDate) : null;
      if (due && status !== "completed") {
        if (due < todayStart) overdue++;
        else if (due >= todayStart && due <= weekEnd) dueThisWeek++;
      }
    }

    const byStatus = STATUSES.map((status) => ({
      status,
      count: statusCounts[status] ?? 0,
    }));

    const dueSoon = projects
      .filter((p) => p.dueDate && p.status !== "completed")
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
      .slice(0, 10)
      .map((p) => ({
        id: p._id.toString(),
        name: p.name,
        status: p.status,
        dueDate: new Date(p.dueDate).toISOString(),
        assigneeName: p.assigneeName ?? "",
      }));

    return NextResponse.json({
      stats: {
        total: projects.length,
        inProgress,
        dueThisWeek,
        overdue,
        completed,
      },
      byStatus,
      dueSoon,
    });
  } catch (err) {
    console.error("dashboard error:", err);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}