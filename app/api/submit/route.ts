import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    // ดึงค่า GOOGLE_CREDENTIALS จาก Environment Variables
    if (!process.env.GOOGLE_CREDENTIALS) {
      throw new Error("GOOGLE_CREDENTIALS is missing from environment variables");
    }

    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = "1iLsKMhj2u3DH6Ddnakr8bMKA1lDEiDo1UMsh96ZD7Qg"; 
    const range = "Sheet1!A:Z";

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values: [[body.CustID, body.CustGroupCode, body.CustFName]] },
    });

    return NextResponse.json({ message: "Data added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Google API Error:", error);
    return NextResponse.json({ message: "Error saving data" }, { status: 500 });
  }
}
