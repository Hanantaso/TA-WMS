import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/common/Card";
import "./PageAdmin.css";
import "./ManajemenGudangAdmin.css";

const fmtIDR = (n) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

const statusPillClass = (s) => {
  if (s === "Pending") return "mgAdmin__pill mgAdmin__pill--pending";
  if (s === "Declined") return "mgAdmin__pill mgAdmin__pill--declined";
  if (s === "Accepted") return "mgAdmin__pill mgAdmin__pill--accepted";
  if (s === "Selesai") return "mgAdmin__pill mgAdmin__pill--done";
  if (s === "Diproses") return "mgAdmin__pill mgAdmin__pill--process";
  return "mgAdmin__pill";
};

export default function ManajemenGudang() {
  const easing = useMemo(() => [0.22, 1, 0.36, 1], []);

  // =========================
  // Dummy: laporan harian
  // =========================
  const [reports] = useState([
    { date: "2026-02-03", title: "Laporan Harian", by: "Gudang", status: "Ada", note: "Stok masuk: 120, keluar: 78" },
    { date: "2026-02-02", title: "Laporan Harian", by: "Gudang", status: "Ada", note: "Audit rak A2 + koreksi 3 item" },
    { date: "2026-02-01", title: "Laporan Harian", by: "Gudang", status: "Tidak ada", note: "—" },
    { date: "2026-01-31", title: "Laporan Harian", by: "Gudang", status: "Ada", note: "Pengiriman 2x ke Toko B" },
    { date: "2026-01-30", title: "Laporan Harian", by: "Gudang", status: "Tidak ada", note: "—" },
  ]);

  // =========================
  // Dummy: stok gudang
  // =========================
  const [warehouseStock] = useState({
    totalItem: 1860,
    kategori: 48,
    lowStock: 5,
    inboundToday: 120,
    outboundToday: 78,
    estimasiNilai: 275000000, // dummy
  });

  // =========================
  // Dummy: request gudang (yang butuh admin action)
  // =========================
  const [requests, setRequests] = useState([
    { id: "G-REQ-011", toko: "Toko A", tanggal: "2026-02-03", item: 12, catatan: "Prioritas: fast moving", decision: "Pending", progress: "Pending" },
    { id: "G-REQ-010", toko: "Toko B", tanggal: "2026-02-02", item: 6, catatan: "Butuh sebelum jam 17:00", decision: "Pending", progress: "Pending" },
    { id: "G-REQ-009", toko: "Toko C", tanggal: "2026-02-01", item: 9, catatan: "Sesuai stok tersedia", decision: "Accepted", progress: "Diproses" },
    { id: "G-REQ-008", toko: "Toko A", tanggal: "2026-01-31", item: 3, catatan: "Pengganti barang rusak", decision: "Declined", progress: "Declined" },
  ]);

  const decide = (id, action) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (action === "accept") return { ...r, decision: "Accepted", progress: "Diproses" };
        return { ...r, decision: "Declined", progress: "Declined" };
      })
    );
  };

  // =========================
  // Dummy: tracking realtime pengiriman (progress anim + update interval)
  // =========================
  const [shipments, setShipments] = useState([
    {
      id: "SHP-201",
      to: "Toko A",
      driver: "Kurir 01",
      eta: "± 25 menit",
      status: "Dalam perjalanan",
      progress: 62,
      route: "Gudang → Jl. Melati → Toko A",
    },
    {
      id: "SHP-200",
      to: "Toko B",
      driver: "Kurir 02",
      eta: "± 10 menit",
      status: "Hampir sampai",
      progress: 86,
      route: "Gudang → Ringroad → Toko B",
    },
    {
      id: "SHP-199",
      to: "Toko C",
      driver: "Kurir 03",
      eta: "Selesai",
      status: "Terkirim",
      progress: 100,
      route: "Gudang → Toko C",
    },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setShipments((prev) =>
        prev.map((s) => {
          if (s.progress >= 100) return s;
          const bump = Math.random() < 0.6 ? 1 : 2;
          const next = Math.min(100, s.progress + bump);
          let status = s.status;
          let eta = s.eta;

          if (next >= 100) {
            status = "Terkirim";
            eta = "Selesai";
          } else if (next >= 85) {
            status = "Hampir sampai";
            eta = "± 10 menit";
          } else if (next >= 55) {
            status = "Dalam perjalanan";
            eta = "± 25 menit";
          }

          return { ...s, progress: next, status, eta };
        })
      );
    }, 900);

    return () => clearInterval(t);
  }, []);

  return (
    <div className="pageAdmin pageAdmin--wide">
      {/* Header */}
      <motion.div
        className="mgAdmin__head"
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: easing }}
      >
        <div>
          <h1 className="mgAdmin__title">Manajemen Gudang</h1>
          <p className="mgAdmin__subtitle">
            Ringkasan operasional gudang: laporan harian, stok, request, dan tracking pengiriman (dummy).
          </p>
        </div>

        <div className="mgAdmin__headRight">
          <span className="mgAdmin__badge mgAdmin__badge--live">
            <span className="mgAdmin__dot" />
            Realtime (dummy)
          </span>
          <span className="mgAdmin__badge">Admin View</span>
        </div>
      </motion.div>

      {/* Top stats */}
      <motion.div
        className="mgAdmin__stats"
        initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.06, duration: 0.55, ease: easing }}
      >
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: easing }}>
          <Card className="mgAdmin__statCard">
            <div className="mgAdmin__statLabel">Total Stok Gudang</div>
            <div className="mgAdmin__statValue">{fmtIDR(warehouseStock.totalItem)} barang</div>
            <div className="mgAdmin__statHint">Kategori: {warehouseStock.kategori}</div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: easing }}>
          <Card className="mgAdmin__statCard">
            <div className="mgAdmin__statLabel">Stok Menipis</div>
            <div className="mgAdmin__statValue">{warehouseStock.lowStock} item</div>
            <div className="mgAdmin__statHint">Perlu perhatian</div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: easing }}>
          <Card className="mgAdmin__statCard">
            <div className="mgAdmin__statLabel">Aktivitas Hari Ini</div>
            <div className="mgAdmin__statValue">
              +{warehouseStock.inboundToday} / -{warehouseStock.outboundToday}
            </div>
            <div className="mgAdmin__statHint">Masuk / Keluar</div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: easing }}>
          <Card className="mgAdmin__statCard">
            <div className="mgAdmin__statLabel">Estimasi Nilai Stok</div>
            <div className="mgAdmin__statValue">Rp {fmtIDR(warehouseStock.estimasiNilai)}</div>
            <div className="mgAdmin__statHint">Dummy nilai total</div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Grid utama */}
      <motion.div
        className="mgAdmin__grid"
        initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.1, duration: 0.55, ease: easing }}
      >
        {/* Laporan harian */}
        <Card className="mgAdmin__card">
          <div className="mgAdmin__cardHead">
            <h3>Laporan Harian Gudang</h3>
            <span className="mgAdmin__pill mgAdmin__pill--soft">Upload oleh Gudang (dummy)</span>
          </div>

          <div className="mgAdmin__reportList">
            {reports.map((r) => (
              <motion.div
                key={r.date}
                className={`mgAdmin__reportRow ${r.status === "Ada" ? "is-ok" : "is-miss"}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: easing }}
              >
                <div className="mgAdmin__reportLeft">
                  <div className="mgAdmin__reportDate">{r.date}</div>
                  <div className="mgAdmin__reportMeta">
                    <b>{r.title}</b> • {r.by}
                  </div>
                  <div className="mgAdmin__reportNote">{r.note}</div>
                </div>

                <div className="mgAdmin__reportRight">
                  <span className={`mgAdmin__pill ${r.status === "Ada" ? "mgAdmin__pill--accepted" : "mgAdmin__pill--declined"}`}>
                    {r.status === "Ada" ? "Tersedia" : "Belum upload"}
                  </span>

                  <button
                    type="button"
                    className={`mgAdmin__miniBtn ${r.status === "Ada" ? "" : "is-disabled"}`}
                    disabled={r.status !== "Ada"}
                    title={r.status === "Ada" ? "Preview laporan (dummy)" : "Belum ada file"}
                  >
                    Preview
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mgAdmin__footNote">
            * Nanti: laporan ini bisa berasal dari upload gudang (file/pdf) + metadata tersimpan di database.
          </div>
        </Card>

        {/* Tracking realtime */}
        <Card className="mgAdmin__card">
          <div className="mgAdmin__cardHead">
            <h3>Tracking Pengiriman (Realtime)</h3>
            <span className="mgAdmin__pill mgAdmin__pill--soft">Auto-update (dummy)</span>
          </div>

          <div className="mgAdmin__shipList">
            {shipments.map((s) => (
              <motion.div
                key={s.id}
                className="mgAdmin__shipRow"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18, ease: easing }}
              >
                <div className="mgAdmin__shipTop">
                  <div>
                    <div className="mgAdmin__shipTitle">
                      <b>{s.id}</b> → {s.to}
                    </div>
                    <div className="mgAdmin__shipMeta">
                      {s.status} • {s.driver} • ETA: {s.eta}
                    </div>
                    <div className="mgAdmin__shipRoute">{s.route}</div>
                  </div>

                  <span className={`mgAdmin__pill ${s.progress >= 100 ? "mgAdmin__pill--done" : s.progress >= 85 ? "mgAdmin__pill--process" : "mgAdmin__pill--pending"}`}>
                    {s.progress >= 100 ? "Terkirim" : s.progress >= 85 ? "Hampir sampai" : "Dalam perjalanan"}
                  </span>
                </div>

                <div className="mgAdmin__progressWrap">
                  <div className="mgAdmin__progressBar">
                    <motion.div
                      className="mgAdmin__progressFill"
                      initial={false}
                      animate={{ width: `${s.progress}%` }}
                      transition={{ duration: 0.6, ease: easing }}
                    />
                  </div>
                  <div className="mgAdmin__progressMeta">{s.progress}%</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mgAdmin__footNote">
            * Nanti: progress bisa berasal dari status pengiriman (websocket / polling).
          </div>
        </Card>

        {/* Request gudang */}
        <Card className="mgAdmin__card mgAdmin__card--full">
          <div className="mgAdmin__cardHead">
            <h3>Request Gudang ke Admin</h3>
            <span className="mgAdmin__pill mgAdmin__pill--soft">Action: Accept / Decline</span>
          </div>

          <div className="mgAdmin__table">
            <div className="mgAdmin__thead">
              <b>ID</b>
              <b>Toko</b>
              <b>Tanggal</b>
              <b>Item</b>
              <b>Catatan</b>
              <b>Decision</b>
              <b>Status</b>
              <b>Aksi</b>
            </div>

            {requests.map((r) => (
              <motion.div
                key={r.id}
                className="mgAdmin__trow"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: easing }}
              >
                <span className="mgAdmin__mono">{r.id}</span>
                <span>{r.toko}</span>
                <span>{r.tanggal}</span>
                <span>{r.item} item</span>
                <span className="mgAdmin__mutedText">{r.catatan}</span>

                <span className={statusPillClass(r.decision)}>{r.decision}</span>
                <span className={statusPillClass(r.progress)}>{r.progress}</span>

                <span className="mgAdmin__actions">
                  {r.decision === "Pending" ? (
                    <>
                      <button
                        type="button"
                        className="mgAdmin__btn mgAdmin__btn--ghost"
                        onClick={() => decide(r.id, "decline")}
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        className="mgAdmin__btn mgAdmin__btn--primary"
                        onClick={() => decide(r.id, "accept")}
                      >
                        Accept
                      </button>
                    </>
                  ) : r.decision === "Accepted" ? (
                    <span className="mgAdmin__acceptedText">Accepted ✓</span>
                  ) : (
                    <span className="mgAdmin__declinedText">Declined ✕</span>
                  )}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mgAdmin__footNote">
            * Setelah <b>Accept</b>, tombol hilang & muncul label <b>Accepted</b>. Status bisa: Pending / Diproses / Selesai / Declined.
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
