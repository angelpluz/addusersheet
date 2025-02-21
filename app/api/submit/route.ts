import { NextResponse } from "next/server";
import { google } from "googleapis";

import path from "path";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    CustID, CustGroupCode, Custtype, CompBoardName, CompBoardID, CustIDNumber, CustTitle,
    CustFName, CustLName, Addr, Tumbon, Amhur, Changwat, ZipCode, CustPhone, CustBirthDate,
    InputUser, TaxBranchID, CustMobile, chassis, dateforinput
  } = body;

  try {
    // โหลดไฟล์ credentials.json
    const credentialsPath = path.join(process.cwd(), "credentials.json");
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = "1iLsKMhj2u3DH6Ddnakr8bMKA1lDEiDo1UMsh96ZD7Qg"; // Google Sheet ID
    const range = "Sheet1!A:Z"; // บันทึกข้อมูลที่ Sheet1

    const values = [
      CustID, CustGroupCode, Custtype, CompBoardName, CompBoardID,
      CustIDNumber, CustTitle || "NULL", CustFName.trim(), CustLName || "NULL",
      Addr.replace(/"/g, ""), Tumbon, Amhur, Changwat, ZipCode,
      CustPhone.trim(), CustBirthDate, InputUser,
      "NULL", "NULL", "NULL", TaxBranchID.replace(/"/g, ""),
      "NULL", "NULL", "NULL", "NULL", CustMobile.trim(), "NULL",
      chassis, dateforinput
    ];

    // ส่งข้อมูลไปที่ Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values: [values] },
    });

    return NextResponse.json({ message: "Data added successfully", values }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error saving data" }, { status: 500 });
  }
}
