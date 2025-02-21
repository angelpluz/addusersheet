"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    CustID: "CU231300060", // Fix ค่า
    CustGroupCode: "Dealer",
    Custtype: "cust",
    CompBoardName: "", // ชื่อประธานบริษัท
    CompBoardID: "", // เลขผู้จดทะเบียนบริษัท
    CustIDNumber: "",
    CustTitle: "",
    CustFName: "",
    CustLName: "",
    Addr: "",
    Tumbon: "",
    Amhur: "",
    Changwat: "",
    ZipCode: "",
    CustPhone: "",
    CustBirthDate: "",
    InputUser: "admin",
    TaxBranchID: "",
    CustMobile: "",
  });

  const [sqlOutput, setSqlOutput] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันแปลงวันที่ (ป้องกันค่าผิดพลาด)
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "") return "NULL";
    const [year, month, day] = dateString.split("-");
    return `'${year}-${month}-${day}'`; // ค.ศ. YYYY-MM-DD
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("กำลังบันทึกข้อมูล...");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("บันทึกข้อมูลสำเร็จ ✅");

        // SQL Statement
        const sql = `INSERT INTO tbCustomer (
  CustID, CustGroupCode, Custtype, CompBoardName, CompBoardID, CustIDNumber,
  CustTitle, CustFName, CustLName, Addr, Tumbon, Amhur, Changwat, ZipCode,
  CustPhone, CustBirthDate, InputUser, InputDate, LastDate, LastUser,
  TaxBranchID, CustCode, CustCancelDate, CustEmail, CustRemark, CustMobile, Custoffice
) VALUES (
  '${formData.CustID}', '${formData.CustGroupCode}', '${formData.Custtype}',
  '${formData.CompBoardName.trim()}', '${formData.CompBoardID.trim()}', '${formData.CustIDNumber.trim()}',
  '${formData.CustTitle || "NULL"}', '${formData.CustFName.trim()}', '${formData.CustLName || "NULL"}',
  '${formData.Addr.replace(/"/g, "").trim()}', '${formData.Tumbon.trim()}', '${formData.Amhur.trim()}', '${formData.Changwat.trim()}', '${formData.ZipCode.trim()}',
  '${formData.CustPhone.trim()}', ${formatDate(formData.CustBirthDate)}, '${formData.InputUser}',
  NULL, NULL, NULL, '${formData.TaxBranchID.trim()}',
  NULL, NULL, NULL, NULL, '${formData.CustMobile.trim()}', NULL
);`;
        setSqlOutput(sql);
      } else {
        setStatus("เกิดข้อผิดพลาด ❌");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setStatus("เกิดข้อผิดพลาด ❌");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">แบบฟอร์มลงทะเบียน</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* รหัสลูกค้า (Fix ค่า) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">รหัสลูกค้า</label>
            <input type="text" value="CU231300060" readOnly className="mt-1 p-2 w-full bg-gray-200 border rounded-md" />
          </div>

          {/* ส่วนข้อมูลทั้งหมด */}
          {[
            { name: "CompBoardName", label: "ชื่อประธานบริษัท" },
            { name: "CompBoardID", label: "เลขผู้จดทะเบียนบริษัท" },
            { name: "CustIDNumber", label: "รหัสบัตรประชาชน" },
            { name: "CustTitle", label: "คำนำหน้า" },
            { name: "CustFName", label: "ชื่อ" },
            { name: "CustLName", label: "นามสกุล" },
            { name: "Addr", label: "ที่อยู่" },
            { name: "Tumbon", label: "ตำบล" },
            { name: "Amhur", label: "อำเภอ" },
            { name: "Changwat", label: "จังหวัด" },
            { name: "ZipCode", label: "รหัสไปรษณีย์" },
            { name: "CustPhone", label: "เบอร์โทรศัพท์" },
            { name: "TaxBranchID", label: "รหัสสาขาภาษี" },
            { name: "CustMobile", label: "เบอร์มือถือ" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input type="text" name={name} value={formData[name as keyof typeof formData]} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}

          {/* วันเกิด */}
          <div>
            <label className="block text-sm font-medium text-gray-700">วันเกิด</label>
            <input type="date" name="CustBirthDate" value={formData.CustBirthDate} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* ปุ่มส่งข้อมูล */}
          <div className="flex justify-center">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">ส่งข้อมูล</button>
          </div>
        </form>

        {/* แสดง SQL Statement */}
        {sqlOutput && (
          <div className="mt-4 p-4 bg-gray-200 rounded-md">
            <h3 className="font-semibold text-gray-700">SQL Statement</h3>
            <textarea readOnly value={sqlOutput} rows={6} className="w-full p-2 mt-2 border rounded-md" />
            <button onClick={() => navigator.clipboard.writeText(sqlOutput)} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">Copy SQL</button>
          </div>
        )}

        {/* แสดงสถานะ */}
        {status && <p className="mt-4 text-center text-gray-600">{status}</p>}
      </div>
    </div>
  );
}
