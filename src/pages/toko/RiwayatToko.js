import Card from "../../components/common/Card";
import "../admin/PageAdmin.css";

const dummy = [
  { id: "REQ-015", tanggal: "2026-02-01", items: "BRG-005 x8", status: "Selesai" },
  { id: "REQ-014", tanggal: "2026-01-31", items: "BRG-002 x12", status: "Selesai" },
];

export default function RiwayatToko() {
  return (
    <div className="pageAdmin">
      <div className="pageAdmin__head">
        <h1>Riwayat</h1>
        <p>Riwayat request & penerimaan barang (placeholder).</p>
      </div>

      <Card className="pageAdmin__card pageAdmin__card--full">
        <div className="pageAdmin__tableHead">
          <b>ID</b><b>Tanggal</b><b>Items</b><b>Status</b>
        </div>

        {dummy.map((r) => (
          <div key={r.id} className="pageAdmin__tableRow">
            <span>{r.id}</span>
            <span>{r.tanggal}</span>
            <span>{r.items}</span>
            <span className={`pageAdmin__pill pageAdmin__pill--${r.status}`}>
              {r.status}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}
