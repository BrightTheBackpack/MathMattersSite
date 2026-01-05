import { NextResponse } from "next/server";
import { db } from "@/context/firebaseAdmin";
import { auth } from "@/context/firebaseAdmin";

export async function PUT(req) {
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

    const data = await req.json();
    await userRef.set(data);

  return NextResponse.json({ message: "Profile updated successfully" });


}
