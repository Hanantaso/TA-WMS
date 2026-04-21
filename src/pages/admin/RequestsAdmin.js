// src/pages/admin/RequestsAdmin.js
import React, { useEffect, useMemo, useState } from "react";
import "./PageAdmin.css";
import {
  adminDecideRestock,
  subscribeRequests,
  subscribeRestockToAdmin,
} from "../../services/wmsApi";

/** ===== helpers (pakai class yang ada di PageAdmin.css) ===== */
const pillClassByStatus = (status) => {
  const s = (status || "").toLowerCase();
  if (!s) return "pageAdmin__pill isPending";

  if (s.includes("menunggu")) return "pageAdmin__pill isPending";
  if (s.includes("pending")) return "pageAdmin__pill isPending";
  if (s.includes("approved")) return "pageAdmin__pill isApproved";
  if (s.includes("accepted")) return "pageAdmin__pill isAccepted";
  if (s.includes("mengirim")) return "pageAdmin__pill isShip";
  if (s.includes("selesai")) return "pageAdmin__pill isDone";
  if (s.includes("ditolak") || s.includes("declined")) return "pageAdmin__pill isDeclined";
  if (s.includes("proses") || s.includes("processing")) return "pageAdmin__pill isProcess";

  return "pageAdmin__pill";
};

const pillClassByDecision = (decision) => {
  const d = (decision || "").toLowerCase();
  if (!d || d === "null") return "pageAdmin__pill isPending";
  if (d === "approved") return "pageAdmin__pill isApproved";
  if (d === "accepted") return "pageAdmin__pill isAccepted";
  if (d === "declined") return "pageAdmin__pill isDeclined";
  return "pageAdmin__pill";
};

const formatItemsShort = (items) => {
  if (!items || !items.length) return "-";
  const first = items[0];
  const qty = first.qty ?? first.jumlah ?? first.amount ?? "-";
  const code = first.code ?? first.kode ?? first.id ?? "BRG";
  const extra = items.length > 1 ? ` +${items.length - 1} item` : "";
  return `${code} — Item x ${qty}${extra}`;
};

export default function RequestsAdmin() {
  const [trxRequests, setTrxRequests] = useState([]); // toko -> gudang
  const [restock, setRestock] = useState([]); // gudang -> admin
  const [proofOpen, setProofOpen] = useState(false);
  const [proofImage, setProofImage] = useState(null);

  useEffect(() => {
    const unsubReq = subscribeRequests((rows) => setTrxRequests(rows || []));
    const unsubRestock = subscribeRestockToAdmin((rows) => setRestock(rows || []));
    return () => {
      if (typeof unsubReq === "function") unsubReq();
      if (typeof unsubRestock === "function") unsubRestock();
    };
  }, []);

  const trxStats = useMemo(() => {
    const total = trxRequests.length;
    const aktif = trxRequests.filter((r) =>
      ["menunggu", "pending", "mengirim"].includes((r.status || "").toLowerCase())
    ).length;
    return { total, aktif };
  }, [trxRequests]);

  const restockStats = useMemo(() => {
    const total = restock.length;
    const pending = restock.filter((r) =>
      ["menunggu"].includes((r.status || "").toLowerCase())
    ).length;
    return { total, pending };
  }, [restock]);

  const handleDecideRestock = async (id, decision) => {
    await adminDecideRestock(id, decision); // "Approved" | "Declined"
  };

  const openProof = (img) => {
    setProofImage(img || null);
    setProofOpen(true);
  };

  return (
    <div className="pageAdmin">
      <div className="pageAdmin__head">
        <div>
          <div className="pageAdmin__title">Requests</div>
          <div className="pageAdmin__sub">
            Admin memonitor transaksi antara Toko ↔ Gudang, serta memproses request restock Gudang.
          </div>
        </div>
      </div>

      {/* ====== SECTION 1: Transaksi Toko ↔ Gudang (read-only admin) ====== */}
      <div className="reqSection">
        <div className="reqTitleRow">
          <div className="reqTitle">Transaksi Toko ↔ Gudang</div>
          <div className="reqMeta">Total: {trxStats.total} • Aktif: {trxStats.aktif}</div>
        </div>

        <div className="reqTable">
          <div
            className="reqTableHead"
            style={{ gridTemplateColumns: "120px 140px 1.2fr 120px 140px 140px" }}
          >
            <div>ID</div>
            <div>Asal</div>
            <div>Items</div>
            <div>Total</div>
            <div>Decision</div>
            <div>Status</div>
          </div>

          {trxRequests.length === 0 ? (
            <div className="reqEmpty">Belum ada transaksi.</div>
          ) : (
            trxRequests.map((r) => {
              const total = (r.items || []).reduce(
                (sum, it) => sum + Number(it.qty ?? it.jumlah ?? 0),
                0
              );

              return (
                <div
                  key={r.id}
                  className="reqTableRow"
                  style={{ gridTemplateColumns: "120px 140px 1.2fr 120px 140px 140px" }}
                >
                  <div className="reqId">{r.id}</div>
                  <div className="reqFrom">{r.fromName || "Toko"}</div>
                  <div className="reqItems">{formatItemsShort(r.items)}</div>
                  <div className="reqTotal">{total}</div>
                  <div>
                    <span className={pillClassByDecision(r.decision)}>
                      {r.decision ? r.decision : "Pending"}
                    </span>
                  </div>
                  <div>
                    <span className={pillClassByStatus(r.status)}>{r.status || "-"}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ====== SECTION 2: Request Restock dari Gudang ====== */}
      <div className="reqSection">
        <div className="reqTitleRow">
          <div className="reqTitle">Request Restock dari Gudang</div>
          <div className="reqMeta">
            Total: {restockStats.total} • Pending: {restockStats.pending}
          </div>
        </div>

        <div className="reqTable">
          <div
            className="reqTableHead"
            style={{ gridTemplateColumns: "120px 160px 1.2fr 120px 140px 140px 170px" }}
          >
            <div>ID</div>
            <div>Gudang</div>
            <div>Items</div>
            <div>Total</div>
            <div>Decision</div>
            <div>Status</div>
            <div>Aksi</div>
          </div>

          {restock.length === 0 ? (
            <div className="reqEmpty">Belum ada request restock gudang.</div>
          ) : (
            restock.map((r) => {
              const total = (r.items || []).reduce(
                (sum, it) => sum + Number(it.qty ?? it.jumlah ?? 0),
                0
              );

              const status = (r.status || "").toLowerCase();
              const canDecide = status.includes("menunggu") || status.includes("pending");
              const isDone = status.includes("selesai");

              return (
                <div
                  key={r.id}
                  className="reqTableRow"
                  style={{ gridTemplateColumns: "120px 160px 1.2fr 120px 140px 140px 170px" }}
                >
                  <div className="reqId">{r.id}</div>
                  <div className="reqFrom">{r.fromName || "Gudang"}</div>
                  <div className="reqItems">{formatItemsShort(r.items)}</div>
                  <div className="reqTotal">{total}</div>

                  <div>
                    <span className={pillClassByDecision(r.decision)}>
                      {r.decision ? r.decision : "Pending"}
                    </span>
                  </div>

                  <div>
                    <span className={pillClassByStatus(r.status)}>{r.status || "-"}</span>
                  </div>

                  <div className="reqActions">
                    {canDecide ? (
                      <>
                        <button
                          className="pageAdmin__btnSmall"
                          onClick={() => handleDecideRestock(r.id, "Approved")}
                        >
                          Accept
                        </button>
                        <button
                          className="pageAdmin__btnSmall isDanger"
                          onClick={() => handleDecideRestock(r.id, "Declined")}
                        >
                          Decline
                        </button>
                      </>
                    ) : isDone ? (
                      <>
                        <button
                          className="pageAdmin__btnSmall isGhost"
                          onClick={() => openProof(r.proofImage)}
                        >
                          Lihat Bukti
                        </button>
                      </>
                    ) : (
                      <span className="reqMuted">-</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ===== Modal Lihat Bukti ===== */}
      {proofOpen && (
        <div className="reqModalOverlay" onClick={() => setProofOpen(false)}>
          <div className="reqModal" onClick={(e) => e.stopPropagation()}>
            <div className="reqModalHead">
              <div className="reqModalTitle">Bukti Restock</div>
              <button className="reqModalClose" onClick={() => setProofOpen(false)}>
                ✕
              </button>
            </div>
            <div className="reqModalBody">
              {!proofImage ? (
                <div className="pageAdmin__muted">Tidak ada bukti.</div>
              ) : (
                <img
                  src={proofImage}
                  alt="bukti"
                  style={{ width: "100%", borderRadius: 14 }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
