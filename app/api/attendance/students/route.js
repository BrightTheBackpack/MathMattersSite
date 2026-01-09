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

  const studentRef = db.collection('student');
  const snapshot = await studentRef.get();
  const students = [];
  snapshot.forEach(doc => {
    students.push({ id: doc.id, studentName: doc.data().studentName });
  });

  return NextResponse.json({ students });
}

export async function POST(req) {
  //todo: add more logic to be able to link student later
  const token = req.headers.get("authorization")?.split("Bearer ")[1];
  let decoded;
    try{
    decoded = await auth.verifyIdToken(token);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const studentRef = db.collection('student');
  await studentRef.add(data);

  return NextResponse.json({ message: "Student added successfully" });
}
