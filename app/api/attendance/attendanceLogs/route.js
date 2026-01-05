import { NextResponse } from "next/server";
import { db } from "@/context/firebaseAdmin";
import { auth } from "@/context/firebaseAdmin";

export async function GET(req) {
  const token = req.headers.get("authorization")?.split("Bearer ")[1];
  let decoded;
  //TODO: verify user is authorized to view attendance logs
  try{
    decoded = await auth.verifyIdToken(token);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logRef = db.collection('attendance');
  q = query(logRef, where("Verified", "==", "false"));
  const snapshot = await q.get();
  const logs = [];
  snapshot.forEach(doc => {
    logs.push({ id: doc.id, ...doc.data() });
  });

  return NextResponse.json({ logs });
}
