import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/common/Card";
import "./PageAdmin.css";
import "./ManajemenTokoAdmin.css";

const fmtIDR = (n) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

const pillClass = (s) => {
  if (s === "Pending") return "mtAdmin__pill mtAdmin__pill--pending";
  if (s === "Declined") return "mtAdmin__pill mtAdmin__pill--declined";
  if (s === "Accepted") return "mtAdmin__pill mtAdmin__pill--accepted";
  if (s === "Selesai") return "mtAdmin__pill mtAdmin__pill--done";
  if (s === "Diproses") return "mtAdmin__pill mtAdmin__pill--process";
  if (s === "dalam perjalanan") return "mtAdmin__pill mtAdmin__pill--otw";
  return "mtAdmin__pill";
};

export default function ManajemenToko() {
  const easing = useMemo(() => [0.22, 1, 0.36, 1], []);

  // =========================
  // Dummy: laporan harian toko
  // =========================
  const [reports] = useState([
    {
      date: "2026-02-03",
      toko: "Toko A",
      status: "Ada",
      note: "Penjualan: 45 transaksi • Retur: 1 • Stok kritis: 2 item",
    },
    {
      date: "2026-02-02",
      toko: "Toko B",
      status: "Ada",
      note: "Penjualan: 31 transaksi • Stok kritis: 1 item",
    },
    { date: "2026-02-01", toko: "Toko C", status: "Tidak ada", note: "—" },
    {
      date: "2026-01-31",
      toko: "Toko A",
      status: "Ada",
      note: "Penjualan: 28 transaksi • Penyesuaian stok: -3 item",
    },
    { date: "2026-01-30", toko: "Toko B", status: "Tidak ada", note: "—" },
  ]);

  // =========================
  // Dummy: ringkasan toko (admin)
  // =========================
  const [summary] = useState({
    tokoAktif: 3,
    transaksiHariIni: 76,
    pendingRestock: 4,
    stokKritisTotal: 5,
    estimasiOmzet: 12500000, // dummy
  });

  // =========================
  // Dummy: transaksi gudang <-> toko
  // =========================
  const [transactions] = useState([
    {
      id: "TRX-301",
      toko: "Toko A",
      tanggal: "2026-02-03",
      tipe: "Pengiriman",
      totalItem: 14,
      nilai: 3250000,
      status: "Diproses",
      ref: "SHP-210",
    },
    {
      id: "TRX-300",
      toko: "Toko B",
      tanggal: "2026-02-02",
      tipe: "Pengiriman",
      totalItem: 9,
      nilai: 1750000,
      status: "dalam perjalanan",
      ref: "SHP-209",
    },
    {
      id: "TRX-299",
      toko: "Toko C",
      tanggal: "2026-02-01",
      tipe: "Pengiriman",
      totalItem: 6,
      nilai: 980000,
      status: "Selesai",
      ref: "SHP-208",
    },
    {
      id: "TRX-298",
      toko: "Toko A",
      tanggal: "2026-01-31",
      tipe: "Retur",
      totalItem: 2,
      nilai: 180000,
      status: "Selesai",
      ref: "RET-120",
    },
  ]);

  // =========================
  // Dummy: request toko ke gudang (dengan action accept/decline)
  // =========================
  const [requests, setRequests] = useState([
    {
      id: "T-REQ-021",
      toko: "Toko A",
      tanggal: "2026-02-03",
      item: 12,
      catatan: "Butuh untuk weekend",
      decision: "Pending",
      progress: "Pending",
    },
    {
      id: "T-REQ-020",
      toko: "Toko B",
      tanggal: "2026-02-02",
      item: 8,
      catatan: "Stok kritis di etalase",
      decision: "Accepted",
      progress: "dalam perjalanan",
    },
    {
      id: "T-REQ-019",
      toko: "Toko C",
      tanggal: "2026-02-01",
      item: 5,
      catatan: "Perlu pengganti item rusak",
      decision: "Declined",
      progress: "Declined",
    },
    {
      id: "T-REQ-018",
      toko: "Toko A",
      tanggal: "2026-01-31",
      item: 3,
      catatan: "Fast moving",
      decision: "Accepted",
      progress: "Selesai",
    },
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
  // Dummy: tracking OTW realtime (auto update)
  // =========================
  const [shipments, setShipments] = useState([
    {
      id: "SHP-210",
      to: "Toko A",
      driver: "Kurir 01",
      eta: "± 20 menit",
      status: "Dalam perjalanan",
      progress: 58,
      route: "Gudang → Jl. Mawar → Toko A",
    },
    {
      id: "SHP-209",
      to: "Toko B",
      driver: "Kurir 02",
      eta: "± 8 menit",
      status: "Hampir sampai",
      progress: 88,
      route: "Gudang → Ringroad → Toko B",
    },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setShipments((prev) =>
        prev.map((s) => {
          if (s.progress >= 100) return s;
          const bump = Math.random() < 0.65 ? 1 : 2;
          const next = Math.min(100, s.progress + bump);

          let status = s.status;
          let eta = s.eta;

          if (next >= 100) {
            status = "Terkirim";
            eta = "Selesai";
          } else if (next >= 85) {
            status = "Hampir sampai";
            eta = "± 8 menit";
          } else if (next >= 55) {
            status = "Dalam perjalanan";
            eta = "± 20 menit";
          }

          return { ...s, progress: next, status, eta };
        })
      );
    }, 900);

    return () => clearInterval(t);
  }, []);

  const shipmentById = useMemo(() => {
    const m = new Map();
    shipments.forEach((s) => m.set(s.id, s));
    return m;
  }, [shipments]);

  return (
    <div className="pageAdmin pageAdmin--wide">
      {/* Header */}
      <motion.div
        className="mtAdmin__head"
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: easing }}
      >
        <div>
          <h1 className="mtAdmin__title">Manajemen Toko</h1>
          <p className="mtAdmin__subtitle">
            Dashboard admin untuk memantau laporan harian toko, transaksi gudang↔toko, request restock, dan pengiriman dalam perjalanan (dummy).
          </p>
        </div>

        <div className="mtAdmin__headRight">
          <span className="mtAdmin__badge mtAdmin__badge--live">
            <span className="mtAdmin__dot" />
            Realtime (dummy)
          </span>
          <span className="mtAdmin__badge">Admin View</span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mtAdmin__stats"
        initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.06, duration: 0.55, ease: easing }}
      >
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: easing }}>
          <Card className="mtAdmin__statCard">
            <div className="mtAdmin__statLabel">Toko Aktif</div>
            <div className="mtAdmin__statValue">{summary.tokoAktif}</div>
            <div className="mtAdmin__statHint">Toko terdaftar (dummy)</div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: easing }}>
          <Card className="mtAdmin__statCard">
            <div className="mtAdmin__statLabel">Transaksi Hari Ini</div>
            <div className="mtAdmin__statValue">{summary.transaksiHariIni}</div>
            <div className="mtAdmin__statHint">Penjualan + pengiriman</div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: easing }}>
          <Card className="mtAdmin__statCard">
            <div className="mtAdmin__statLabel">Pending Restock</div>
            <div className="mtAdmin__statValue">{summary.pendingRestock}</div>
            <div className="mtAdmin__statHint">Request toko yang aktif</div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: easing }}>
          <Card className="mtAdmin__statCard">
            <div className="mtAdmin__statLabel">Estimasi Omzet</div>
            <div className="mtAdmin__statValue">Rp {fmtIDR(summary.estimasiOmzet)}</div>
            <div className="mtAdmin__statHint">Dummy hari ini</div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="mtAdmin__grid"
        initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.1, duration: 0.55, ease: easing }}
      >
        {/* Laporan harian */}
        <Card className="mtAdmin__card">
          <div className="mtAdmin__cardHead">
            <h3>Laporan Harian Toko</h3>
            <span className="mtAdmin__pill mtAdmin__pill--soft">Upload oleh Toko (dummy)</span>
          </div>

          <div className="mtAdmin__reportList">
            {reports.map((r) => (
              <motion.div
                key={`${r.date}-${r.toko}`}
                className={`mtAdmin__reportRow ${r.status === "Ada" ? "is-ok" : "is-miss"}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: easing }}
              >
                <div className="mtAdmin__reportLeft">
                  <div className="mtAdmin__reportDate">{r.date}</div>
                  <div className="mtAdmin__reportMeta">
                    <b>{r.toko}</b> • Laporan Harian
                  </div>
                  <div className="mtAdmin__reportNote">{r.note}</div>
                </div>

                <div className="mtAdmin__reportRight">
                  <span className={pillClass(r.status === "Ada" ? "Accepted" : "Declined")}>
                    {r.status === "Ada" ? "Tersedia" : "Belum upload"}
                  </span>

                  <button
                    type="button"
                    className={`mtAdmin__miniBtn ${r.status === "Ada" ? "" : "is-disabled"}`}
                    disabled={r.status !== "Ada"}
                    title={r.status === "Ada" ? "Preview laporan (dummy)" : "Belum ada file"}
                  >
                    Preview
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mtAdmin__footNote">
            * Nanti: laporan ini bisa berasal dari upload toko (file/pdf) + metadata tersimpan di database.
          </div>
        </Card>

        {/* Realtime OTW */}
        <Card className="mtAdmin__card">
          <div className="mtAdmin__cardHead">
            <h3>Pengiriman dalam perjalanan ke Toko</h3>
            <span className="mtAdmin__pill mtAdmin__pill--soft">Auto-update (dummy)</span>
          </div>

          <div className="mtAdmin__shipList">
            {shipments.map((s) => (
              <motion.div
                key={s.id}
                className="mtAdmin__shipRow"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18, ease: easing }}
              >
                <div className="mtAdmin__shipTop">
                  <div>
                    <div className="mtAdmin__shipTitle">
                      <b>{s.id}</b> → {s.to}
                    </div>
                    <div className="mtAdmin__shipMeta">
                      {s.status} • {s.driver} • ETA: {s.eta}
                    </div>
                    <div className="mtAdmin__shipRoute">{s.route}</div>
                  </div>

                  <span className={pillClass(s.progress >= 100 ? "Selesai" : "dalam perjalanan")}>
                    {s.progress >= 100 ? "Terkirim" : "dalam perjalanan"}
                  </span>
                </div>

                <div className="mtAdmin__progressWrap">
                  <div className="mtAdmin__progressBar">
                    <motion.div
                      className="mtAdmin__progressFill"
                      initial={false}
                      animate={{ width: `${s.progress}%` }}
                      transition={{ duration: 0.6, ease: easing }}
                    />
                  </div>
                  <div className="mtAdmin__progressMeta">{s.progress}%</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mtAdmin__footNote">
            * Nanti: progress bisa berasal dari status pengiriman (websocket / polling).
          </div>
        </Card>

        {/* Transaksi gudang <-> toko */}
        <Card className="mtAdmin__card mtAdmin__card--full">
          <div className="mtAdmin__cardHead">
            <h3>Data Transaksi Gudang ↔ Toko</h3>
            <span className="mtAdmin__pill mtAdmin__pill--soft">Selesai / Diproses / dalam perjalanan</span>
          </div>

          <div className="mtAdmin__table">
            <div className="mtAdmin__thead">
              <b>ID</b>
              <b>Toko</b>
              <b>Tanggal</b>
              <b>Tipe</b>
              <b>Item</b>
              <b>Nilai</b>
              <b>Status</b>
              <b>Tracking</b>
            </div>

            {transactions.map((t) => {
              const ship = shipmentById.get(t.ref);
              const trackingText =
                t.status === "dalam perjalanan" && ship
                  ? `${ship.status} • ${ship.progress}% • ETA ${ship.eta}`
                  : t.status === "Diproses"
                  ? "Sedang diproses gudang"
                  : "—";

              return (
                <motion.div
                  key={t.id}
                  className="mtAdmin__trow"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: easing }}
                >
                  <span className="mtAdmin__mono">{t.id}</span>
                  <span>{t.toko}</span>
                  <span>{t.tanggal}</span>
                  <span>{t.tipe}</span>
                  <span>{t.totalItem} item</span>
                  <span>Rp {fmtIDR(t.nilai)}</span>
                  <span className={pillClass(t.status === "dalam perjalanan" ? "dalam perjalanan" : t.status)}>
                    {t.status}
                  </span>
                  <span className="mtAdmin__mutedText">{trackingText}</span>
                </motion.div>
              );
            })}
          </div>

          <div className="mtAdmin__footNote">
            * Jika status <b>dalam perjalanan</b>, bagian tracking akan menampilkan progress realtime (dummy).
          </div>
        </Card>

        {/* Request toko ke gudang */}
        <Card className="mtAdmin__card mtAdmin__card--full">
          <div className="mtAdmin__cardHead">
            <h3>Request Toko → Gudang</h3>
            <span className="mtAdmin__pill mtAdmin__pill--soft">Action: Accept / Decline</span>
          </div>

          <div className="mtAdmin__table">
            <div className="mtAdmin__thead mtAdmin__thead--req">
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
                className="mtAdmin__trow mtAdmin__trow--req"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: easing }}
              >
                <span className="mtAdmin__mono">{r.id}</span>
                <span>{r.toko}</span>
                <span>{r.tanggal}</span>
                <span>{r.item} item</span>
                <span className="mtAdmin__mutedText">{r.catatan}</span>

                <span className={pillClass(r.decision)}>{r.decision}</span>
                <span className={pillClass(r.progress)}>{r.progress}</span>

                <span className="mtAdmin__actions">
                  {r.decision === "Pending" ? (
                    <>
                      <button
                        type="button"
                        className="mtAdmin__btn mtAdmin__btn--ghost"
                        onClick={() => decide(r.id, "decline")}
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        className="mtAdmin__btn mtAdmin__btn--primary"
                        onClick={() => decide(r.id, "accept")}
                      >
                        Accept
                      </button>
                    </>
                  ) : r.decision === "Accepted" ? (
                    <span className="mtAdmin__acceptedText">Accepted ✓</span>
                  ) : (
                    <span className="mtAdmin__declinedText">Declined ✕</span>
                  )}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mtAdmin__footNote">
            * Setelah <b>Accept</b>, tombol hilang & muncul label <b>Accepted</b>. Status bisa: Pending / Diproses / OTW / Selesai / Declined.
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
