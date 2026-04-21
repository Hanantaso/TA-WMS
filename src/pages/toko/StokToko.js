import Card from "../../components/common/Card";
import "../admin/PageAdmin.css";

export default function StokToko() {
  return (
    <div className="pageAdmin">
      <div className="pageAdmin__head">
        <h1>Stok Toko</h1>
        <p>Monitoring stok barang di toko (placeholder).</p>
      </div>

      <div className="pageAdmin__grid">
        <Card className="pageAdmin__card">
          <h3>Ringkasan</h3>
          <div className="pageAdmin__row"><span>Total barang</span><b>—</b></div>
          <div className="pageAdmin__row"><span>Stok menipis</span><b>—</b></div>
          <button className="pageAdmin__btn">Cek Alert</button>
        </Card>

        <Card className="pageAdmin__card">
          <h3>Aksi</h3>
          <button className="pageAdmin__btn">Buat Request</button>
          <button className="pageAdmin__btn pageAdmin__btn--ghost">Import (Coming Soon)</button>
        </Card>
      </div>
    </div>
  );
}
