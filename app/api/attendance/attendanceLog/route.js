import { NextResponse } from "next/server";
import { db } from "@/context/firebaseAdmin";
import { auth } from "@/context/firebaseAdmin";

export async function POST(req) {
  const token = req.headers.get("authorization")?.split("Bearer ")[1];
  let decoded;
  try{
    decoded = await auth.verifyIdToken(token);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logRef = db.collection('attendance').doc();

  const data = await req.json();
  await logRef.set(data);

  return NextResponse.json({ message: "Attendance log saved successfully" });
}
