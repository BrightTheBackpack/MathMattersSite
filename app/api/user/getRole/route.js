import { NextResponse } from "next/server";
import { db } from "@/context/firebaseAdmin";
import { auth } from "@/context/firebaseAdmin";
export async function GET(req) {
  const token = req.headers.get("authorization")?.split("Bearer ")[1];
  let decoded;
  try{
    decoded = await auth.verifyIdToken(token);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use the Firebase Admin SDK (namespaced) API against the admin Firestore instance `db`.
  // `db` is created with `admin.firestore()` so we must use `.collection(...).doc(...).get()`
  const userRef = db.collection('users').doc(decoded.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const role = userDoc.data().userType;

  return NextResponse.json({ role });
}
