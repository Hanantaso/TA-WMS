import { useMemo, useState } from "react";
import Card from "../../components/common/Card";
import "./PageAdmin.css";

const LS_KEY_GUDANG_NOTIF = "reastock_notifications_gudang_v1";

export default function ManajemenStok() {
  // ===== Dummy summary (nanti tinggal ganti dari API) =====
  const summary = useMemo(() => {
    const totalPerusahaan = 2104;
    const stokGudang = 1860;
    const stokToko = 244;
    return { totalPerusahaan, stokGudang, stokToko };
  }, []);

  // ===== Dummy riwayat request (nanti tinggal ganti dari API) =====
  const [requests, setRequests] = useState([
    {
      id: "ADD-001",
      tanggal: "2026-02-01 09:12",
      barang: "BRG-002 (Lampu LED)",
      jumlah: 50,
      catatan: "Tambah stok untuk promo akhir pekan",
      status: "Selesai",
    },
    {
      id: "ADD-002",
      tanggal: "2026-02-02 14:30",
      barang: "BRG-010 (Kabel 10m)",
      jumlah: 20,
      catatan: "Restock rutin",
      status: "Pending",
    },
    {
      id: "ADD-003",
      tanggal: "2026-02-03 10:05",
      barang: "BRG-017 (Kran Air)",
      jumlah: 15,
      catatan: "Permintaan owner",
      status: "Pending",
    },
  ]);

  // ===== Modal form state =====
  const [openForm, setOpenForm] = useState(false);
  const [sentBanner, setSentBanner] = useState(""); // "penambahan stok telah terkirim"
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    kodeBarang: "",
    namaBarang: "",
    kategori: "Peralatan",
    jumlah: "",
    satuan: "pcs",
    supplier: "",
    prioritas: "Normal",
    catatan: "",
  });

  function resetForm() {
    setForm({
      kodeBarang: "",
      namaBarang: "",
      kategori: "Peralatan",
      jumlah: "",
      satuan: "pcs",
      supplier: "",
      prioritas: "Normal",
      catatan: "",
    });
  }

  function nowStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  }

  function nextId() {
    const n = requests.length + 1;
    return `ADD-${String(n).padStart(3, "0")}`;
  }

  function pushNotifToGudang(payload) {
    try {
      const raw = localStorage.getItem(LS_KEY_GUDANG_NOTIF);
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(payload);
      localStorage.setItem(LS_KEY_GUDANG_NOTIF, JSON.stringify(arr));
    } catch {
      // kalau localStorage error, kita diamkan saja biar tidak merusak flow
    }
  }

  function handleSend(e) {
    e.preventDefault();

    // Validasi ringan (biar tidak bikin crash)
    if (!form.kodeBarang.trim() || !form.namaBarang.trim() || !String(form.jumlah).trim()) {
      setToast("Mohon lengkapi Kode Barang, Nama Barang, dan Jumlah.");
      window.setTimeout(() => setToast(""), 2200);
      return;
    }

    const newReq = {
      id: nextId(),
      tanggal: nowStamp(),
      barang: `${form.kodeBarang.trim()} (${form.namaBarang.trim()})`,
      jumlah: Number(form.jumlah),
      catatan: form.catatan?.trim() || "-",
      status: "Pending",
    };

    // Tambahkan ke tabel admin
    setRequests((prev) => [newReq, ...prev]);

    // Simulasikan "terkirim ke gudang" (notifikasi)
    pushNotifToGudang({
      type: "ADD_STOK_GUDANG",
      title: "Perintah penambahan stok (Admin/Owner)",
      createdAt: newReq.tanggal,
      payload: {
        id: newReq.id,
        kodeBarang: form.kodeBarang.trim(),
        namaBarang: form.namaBarang.trim(),
        kategori: form.kategori,
        jumlah: Number(form.jumlah),
        satuan: form.satuan,
        supplier: form.supplier?.trim() || "-",
        prioritas: form.prioritas,
        catatan: form.catatan?.trim() || "-",
      },
      read: false,
    });

    // UI feedback
    setOpenForm(false);
    resetForm();
    setSentBanner("Penambahan stok telah terkirim.");
    window.setTimeout(() => setSentBanner(""), 2600);

    setToast("Request berhasil dikirim ke Gudang (dummy).");
    window.setTimeout(() => setToast(""), 2200);
  }

  const statusClass = (s) => {
    if (s === "Selesai") return "stokAdmin__badge stokAdmin__badge--ok";
    if (s === "Pending") return "stokAdmin__badge stokAdmin__badge--warn";
    return "stokAdmin__badge";
  };

  return (
    <div className="pageAdmin">
      <style>{`
        /* ===== Scoped styles khusus ManajemenStok (aman tidak ganggu halaman lain) ===== */
        .stokAdmin__grid2 {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 980px) {
          .stokAdmin__grid2 { grid-template-columns: 1fr; }
        }

        .stokAdmin__kpis {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 10px;
        }
        @media (max-width: 980px) {
          .stokAdmin__kpis { grid-template-columns: 1fr; }
        }
        .stokAdmin__kpi {
          padding: 14px;
          border-radius: 14px;
          background: rgba(255,255,255,0.35);
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 10px 24px rgba(0,0,0,0.06);
          transform: translateY(0);
          animation: stokAdminFadeUp 420ms ease both;
        }
        .stokAdmin__kpi:nth-child(2){ animation-delay: 60ms; }
        .stokAdmin__kpi:nth-child(3){ animation-delay: 120ms; }
        .stokAdmin__kpiLabel { font-size: 12px; opacity: 0.75; margin-bottom: 6px; }
        .stokAdmin__kpiValue { font-size: 22px; font-weight: 800; letter-spacing: 0.2px; }
        .stokAdmin__kpiSub { font-size: 12px; opacity: 0.7; margin-top: 4px; }

        .stokAdmin__panelTitle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }
        .stokAdmin__muted { opacity: 0.75; font-size: 13px; }

        .stokAdmin__banner {
          margin-top: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.55);
          animation: stokAdminPop 420ms ease both;
          font-weight: 600;
        }

        .stokAdmin__tableWrap {
          margin-top: 16px;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.25);
          box-shadow: 0 14px 30px rgba(0,0,0,0.06);
          animation: stokAdminFadeUp 420ms ease both;
        }
        .stokAdmin__table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .stokAdmin__table thead th {
          text-align: left;
          padding: 12px 14px;
          font-size: 12px;
          opacity: 0.8;
          background: rgba(255,255,255,0.3);
        }
        .stokAdmin__table tbody td {
          padding: 12px 14px;
          border-top: 1px solid rgba(0,0,0,0.06);
          vertical-align: top;
        }
        .stokAdmin__table tbody tr {
          transition: transform 180ms ease, background 180ms ease;
        }
        .stokAdmin__table tbody tr:hover {
          background: rgba(255,255,255,0.22);
          transform: translateY(-1px);
        }

        .stokAdmin__badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 12px;
          border: 1px solid rgba(0,0,0,0.12);
          background: rgba(255,255,255,0.4);
        }
        .stokAdmin__badge--ok {
          border-color: rgba(0, 150, 90, 0.25);
        }
        .stokAdmin__badge--warn {
          border-color: rgba(190, 120, 0, 0.25);
        }

        /* ===== Modal ===== */
        .stokAdmin__overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          animation: stokAdminOverlayIn 220ms ease both;
        }
        .stokAdmin__modal {
          width: min(760px, 100%);
          border-radius: 18px;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(0,0,0,0.10);
          box-shadow: 0 22px 70px rgba(0,0,0,0.25);
          overflow: hidden;
          transform-origin: center;
          animation: stokAdminModalIn 260ms ease both;
        }
        .stokAdmin__modalHead {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.7);
        }
        .stokAdmin__modalTitle {
          font-size: 16px;
          font-weight: 800;
          margin: 0;
          color: #111;
        }
        .stokAdmin__modalClose {
          border: 0;
          background: transparent;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          opacity: 0.7;
        }
        .stokAdmin__modalBody { padding: 16px; }

        .stokAdmin__formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 720px) {
          .stokAdmin__formGrid { grid-template-columns: 1fr; }
        }
        .stokAdmin__field label {
          display: block;
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 6px;
          font-weight: 700;
        }
        .stokAdmin__field input,
        .stokAdmin__field select,
        .stokAdmin__field textarea {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.12);
          padding: 10px 12px;
          background: rgba(255,255,255,0.85);
          outline: none;
        }
        .stokAdmin__field textarea { min-height: 90px; resize: vertical; }
        .stokAdmin__formActions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 14px;
        }
        .stokAdmin__hint {
          margin-top: 10px;
          font-size: 12px;
          opacity: 0.75;
        }

        /* ===== Toast ===== */
        .stokAdmin__toast {
          position: fixed;
          left: 50%;
          bottom: 22px;
          transform: translateX(-50%);
          z-index: 1000;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(0,0,0,0.12);
          box-shadow: 0 18px 50px rgba(0,0,0,0.18);
          font-size: 13px;
          font-weight: 700;
          animation: stokAdminToastIn 260ms ease both;
        }

        @keyframes stokAdminFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes stokAdminPop {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes stokAdminOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes stokAdminModalIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes stokAdminToastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <div className="pageAdmin__head">
        <h1>Manajemen Stok</h1>
        <p>Monitoring stok perusahaan + permintaan penambahan stok gudang.</p>

        {!!sentBanner && <div className="stokAdmin__banner">{sentBanner}</div>}
      </div>

      <div className="stokAdmin__grid2">
        <Card className="pageAdmin__card">
          <div className="stokAdmin__panelTitle">
            <h3 style={{ margin: 0 }}>Ringkasan Stok</h3>
            <span className="stokAdmin__muted">Realtime (dummy)</span>
          </div>

          <div className="stokAdmin__kpis">
            <div className="stokAdmin__kpi">
              <div className="stokAdmin__kpiLabel">Total Stok Perusahaan</div>
              <div className="stokAdmin__kpiValue">{summary.totalPerusahaan.toLocaleString("id-ID")}</div>
              <div className="stokAdmin__kpiSub">Gudang + Toko</div>
            </div>

            <div className="stokAdmin__kpi">
              <div className="stokAdmin__kpiLabel">Stok Tersedia di Gudang</div>
              <div className="stokAdmin__kpiValue">{summary.stokGudang.toLocaleString("id-ID")}</div>
              <div className="stokAdmin__kpiSub">Siap distribusi</div>
            </div>

            <div className="stokAdmin__kpi">
              <div className="stokAdmin__kpiLabel">Stok Tersedia di Toko</div>
              <div className="stokAdmin__kpiValue">{summary.stokToko.toLocaleString("id-ID")}</div>
              <div className="stokAdmin__kpiSub">Siap jual</div>
            </div>
          </div>
        </Card>

        <Card className="pageAdmin__card">
          <div className="stokAdmin__panelTitle">
            <h3 style={{ margin: 0 }}>Aksi</h3>
            <span className="stokAdmin__muted">Admin/Owner</span>
          </div>

          <button
            className="pageAdmin__btn"
            onClick={() => {
              setSentBanner("");
              setOpenForm(true);
            }}
          >
            Tambah Stok Gudang
          </button>

          <button className="pageAdmin__btn pageAdmin__btn--ghost" disabled>
            Import (Coming Soon)
          </button>

          <div className="stokAdmin__hint">
            *Saat ini pengiriman “request penambahan stok” disimulasikan dan disimpan ke <b>localStorage</b> untuk notifikasi gudang.
          </div>
        </Card>
      </div>

      <div className="stokAdmin__tableWrap" style={{ marginTop: 18 }}>
        <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 800 }}>Riwayat Request Penambahan Stok ke Gudang</div>
            <div className="stokAdmin__muted">Status akan berubah setelah gudang melakukan konfirmasi (dummy).</div>
          </div>
          <div className="stokAdmin__muted" style={{ whiteSpace: "nowrap" }}>
            Total: <b>{requests.length}</b>
          </div>
        </div>

        <table className="stokAdmin__table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>ID</th>
              <th style={{ width: 150 }}>Tanggal</th>
              <th>Barang</th>
              <th style={{ width: 90 }}>Jumlah</th>
              <th>Catatan</th>
              <th style={{ width: 120 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td><b>{r.id}</b></td>
                <td>{r.tanggal}</td>
                <td>{r.barang}</td>
                <td><b>{r.jumlah}</b></td>
                <td>{r.catatan}</td>
                <td>
                  <span className={statusClass(r.status)}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Modal Form ===== */}
      {openForm && (
        <div
          className="stokAdmin__overlay"
          onMouseDown={(e) => {
            // klik area gelap untuk close (tidak merusak flow)
            if (e.target.classList.contains("stokAdmin__overlay")) setOpenForm(false);
          }}
        >
          <div className="stokAdmin__modal" role="dialog" aria-modal="true" aria-label="Form tambah stok gudang">
            <div className="stokAdmin__modalHead">
              <h3 className="stokAdmin__modalTitle">Form Penambahan Stok Gudang</h3>
              <button className="stokAdmin__modalClose" onClick={() => setOpenForm(false)} aria-label="Tutup">
                ×
              </button>
            </div>

            <div className="stokAdmin__modalBody">
              <form onSubmit={handleSend}>
                <div className="stokAdmin__formGrid">
                  <div className="stokAdmin__field">
                    <label>Kode Barang</label>
                    <input
                      value={form.kodeBarang}
                      onChange={(e) => setForm((p) => ({ ...p, kodeBarang: e.target.value }))}
                      placeholder="contoh: BRG-021"
                    />
                  </div>

                  <div className="stokAdmin__field">
                    <label>Nama Barang</label>
                    <input
                      value={form.namaBarang}
                      onChange={(e) => setForm((p) => ({ ...p, namaBarang: e.target.value }))}
                      placeholder="contoh: Pipa 1/2 inch"
                    />
                  </div>

                  <div className="stokAdmin__field">
                    <label>Kategori</label>
                    <select
                      value={form.kategori}
                      onChange={(e) => setForm((p) => ({ ...p, kategori: e.target.value }))}
                    >
                      <option>Peralatan</option>
                      <option>Bahan Bangunan</option>
                      <option>Elektrikal</option>
                      <option>Plumbing</option>
                      <option>Lainnya</option>
                    </select>
                  </div>

                  <div className="stokAdmin__field">
                    <label>Jumlah</label>
                    <input
                      type="number"
                      value={form.jumlah}
                      onChange={(e) => setForm((p) => ({ ...p, jumlah: e.target.value }))}
                      placeholder="contoh: 50"
                      min="1"
                    />
                  </div>

                  <div className="stokAdmin__field">
                    <label>Satuan</label>
                    <select
                      value={form.satuan}
                      onChange={(e) => setForm((p) => ({ ...p, satuan: e.target.value }))}
                    >
                      <option value="pcs">pcs</option>
                      <option value="box">box</option>
                      <option value="pack">pack</option>
                      <option value="kg">kg</option>
                      <option value="meter">meter</option>
                    </select>
                  </div>

                  <div className="stokAdmin__field">
                    <label>Supplier (opsional)</label>
                    <input
                      value={form.supplier}
                      onChange={(e) => setForm((p) => ({ ...p, supplier: e.target.value }))}
                      placeholder="contoh: PT Sumber Makmur"
                    />
                  </div>

                  <div className="stokAdmin__field">
                    <label>Prioritas</label>
                    <select
                      value={form.prioritas}
                      onChange={(e) => setForm((p) => ({ ...p, prioritas: e.target.value }))}
                    >
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>

                  <div className="stokAdmin__field" style={{ gridColumn: "1 / -1" }}>
                    <label>Catatan</label>
                    <textarea
                      value={form.catatan}
                      onChange={(e) => setForm((p) => ({ ...p, catatan: e.target.value }))}
                      placeholder="Catatan tambahan untuk gudang (opsional)"
                    />
                  </div>
                </div>

                <div className="stokAdmin__formActions">
                  <button
                    type="button"
                    className="pageAdmin__btn pageAdmin__btn--ghost"
                    onClick={resetForm}
                  >
                    Clear
                  </button>

                  <button type="submit" className="pageAdmin__btn">
                    Send
                  </button>
                </div>
              </form>

              <div className="stokAdmin__hint">
                Setelah kamu klik <b>Send</b>, form akan tertutup dan muncul info bahwa request sudah terkirim, lalu akan masuk ke tabel riwayat (dan notifikasi gudang via localStorage).
              </div>
            </div>
          </div>
        </div>
      )}

      {!!toast && <div className="stokAdmin__toast">{toast}</div>}
    </div>
  );
}
