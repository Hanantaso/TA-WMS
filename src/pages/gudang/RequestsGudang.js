// src/pages/gudang/RequestsGudang.js
import React, { useEffect, useMemo, useState } from "react";
import "../admin/PageAdmin.css";
import { useNavigate } from "react-router-dom";
import {
  createRestockToAdmin,
  gudangDecideRequest,
  gudangFinishRestockWithProof,
  gudangKirimBarang,
  startShipment,
  subscribeRequests,
  subscribeRestockToAdmin,
} from "../../services/wmsApi";

const pillClassByStatus = (status) => {
  const s = (status || "").toLowerCase();
  if (!s) return "pageAdmin__pill isPending";

  if (s.includes("menunggu")) return "pageAdmin__pill isPending";
  if (s.includes("pending")) return "pageAdmin__pill isPending";
  if (s.includes("accepted") || s.includes("approved")) return "pageAdmin__pill isAccepted";
  if (s.includes("mengirim")) return "pageAdmin__pill isShip";
  if (s.includes("selesai") || s.includes("done")) return "pageAdmin__pill isDone";
  if (s.includes("ditolak") || s.includes("declined")) return "pageAdmin__pill isDeclined";
  if (s.includes("proses") || s.includes("processing")) return "pageAdmin__pill isProcess";

  return "pageAdmin__pill";
};

const pillClassByDecision = (decision) => {
  const d = (decision || "").toLowerCase();
  if (!d || d === "null") return "pageAdmin__pill isPending";
  if (d === "accepted" || d === "approved") return "pageAdmin__pill isAccepted";
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

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function RequestsGudang() {
  const navigate = useNavigate();

  const [allReq, setAllReq] = useState([]); // toko -> gudang
  const [restockToAdmin, setRestockToAdmin] = useState([]); // gudang -> admin

  // modal bukti restock (Selesai)
  const [proofOpen, setProofOpen] = useState(false);
  const [proofReqId, setProofReqId] = useState(null);
  const [proofBase64, setProofBase64] = useState(null);

  // modal buat request restock
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockNote, setRestockNote] = useState("");
  const [restockItems, setRestockItems] = useState([{ code: "", qty: "" }]);

  useEffect(() => {
    const unsubReq = subscribeRequests((rows) => setAllReq(rows || []));
    const unsubRestock = subscribeRestockToAdmin((rows) => setRestockToAdmin(rows || []));
    return () => {
      if (typeof unsubReq === "function") unsubReq();
      if (typeof unsubRestock === "function") unsubRestock();
    };
  }, []);

  const tokoToGudang = useMemo(() => {
    return allReq.filter((r) => (r.fromRole || "").toLowerCase() === "toko");
  }, [allReq]);

  const tokoStats = useMemo(() => {
    const total = tokoToGudang.length;
    const pending = tokoToGudang.filter((r) =>
      ["menunggu", "pending"].includes((r.status || "").toLowerCase())
    ).length;
    return { total, pending };
  }, [tokoToGudang]);

  const restockStats = useMemo(() => {
    const total = restockToAdmin.length;
    const pending = restockToAdmin.filter((r) =>
      ["menunggu", "pending"].includes((r.status || "").toLowerCase())
    ).length;
    return { total, pending };
  }, [restockToAdmin]);

  const decideTokoReq = async (id, decision) => {
    await gudangDecideRequest(id, decision); // "Accepted" / "Declined"
  };

  const handleKirimBarang = async (id) => {
    await gudangKirimBarang(id);
    await startShipment(id);
  };

  const handleLihatPengiriman = (id) => {
    navigate(`/gudang/pengiriman/${id}`);
  };

  // ====== RESTOCK -> ADMIN (Buat Request) ======

  const openRestockModal = () => {
    setRestockItems([{ code: "", qty: "" }]);
    setRestockNote("");
    setRestockOpen(true);
  };

  const addRestockRow = () => {
    setRestockItems((prev) => [...prev, { code: "", qty: "" }]);
  };

  const removeRestockRow = (idx) => {
    setRestockItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateRestockRow = (idx, key, value) => {
    setRestockItems((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [key]: value } : row))
    );
  };

  const normalizedRestockItems = useMemo(() => {
    return (restockItems || [])
      .map((r) => ({
        code: String(r.code || "").trim(),
        qty: Number(r.qty || 0),
      }))
      .filter((r) => r.code && r.qty > 0);
  }, [restockItems]);

  const canSubmitRestock = normalizedRestockItems.length > 0;

  const submitRestockToAdmin = async () => {
    if (!canSubmitRestock) return;

    await createRestockToAdmin({
      fromRole: "gudang",
      fromName: "Gudang",
      items: normalizedRestockItems,
      note: restockNote,
    });

    setRestockOpen(false);
  };

  // ====== RESTOCK finish with proof ======
  const openProofModal = (id) => {
    setProofReqId(id);
    setProofBase64(null);
    setProofOpen(true);
  };

  const submitProof = async () => {
    if (!proofReqId || !proofBase64) return;
    await gudangFinishRestockWithProof(proofReqId, proofBase64);
    setProofOpen(false);
  };

  return (
    <div className="pageAdmin">
      <div className="pageAdmin__head">
        <div>
          <div className="pageAdmin__title">Requests</div>
          <div className="pageAdmin__sub">
            Riwayat transaksi request antara Gudang dan Toko, serta request restock Gudang ke Admin.
          </div>
        </div>
      </div>

      {/* ====== SECTION 1: Request dari Toko ====== */}
      <div className="reqSection">
        <div className="reqTitleRow">
          <div className="reqTitle">Request dari Toko</div>
          <div className="reqMeta">
            Total: {tokoStats.total} • Pending: {tokoStats.pending}
          </div>
        </div>

        <div className="reqTable">
          <div
            className="reqTableHead"
            style={{ gridTemplateColumns: "120px 120px 1.2fr 90px 140px 140px 170px" }}
          >
            <div>ID</div>
            <div>Asal</div>
            <div>Items</div>
            <div>Total</div>
            <div>Decision</div>
            <div>Status</div>
            <div>Aksi</div>
          </div>

          {tokoToGudang.length === 0 ? (
            <div className="reqEmpty">Belum ada request dari toko.</div>
          ) : (
            tokoToGudang.map((r) => {
              const total = (r.items || []).reduce(
                (sum, it) => sum + Number(it.qty ?? it.jumlah ?? 0),
                0
              );

              const status = (r.status || "").toLowerCase();
              const decision = (r.decision || "").toLowerCase();

              const canDecide = status.includes("menunggu") || status.includes("pending");
              const accepted = decision === "accepted" || status.includes("accepted");
              const shipping = status.includes("mengirim");
              const done = status.includes("selesai") || status.includes("done");

              // setelah accepted -> gudang bisa "Kirim Barang"
              const showKirimBarang = accepted && !shipping && !done;
              const showLihatPengiriman = shipping && !done;

              return (
                <div
                  key={r.id}
                  className="reqTableRow"
                  style={{ gridTemplateColumns: "120px 120px 1.2fr 90px 140px 140px 170px" }}
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

                  <div className="reqActions">
                    {canDecide ? (
                      <>
                        <button
                          className="pageAdmin__btnSmall"
                          onClick={() => decideTokoReq(r.id, "Accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="pageAdmin__btnSmall isDanger"
                          onClick={() => decideTokoReq(r.id, "Declined")}
                        >
                          Decline
                        </button>
                      </>
                    ) : showKirimBarang ? (
                      <button className="pageAdmin__btnSmall" onClick={() => handleKirimBarang(r.id)}>
                        Kirim Barang
                      </button>
                    ) : showLihatPengiriman ? (
                      <button
                        className="pageAdmin__btnSmall isGhost"
                        onClick={() => handleLihatPengiriman(r.id)}
                      >
                        Lihat Pengiriman
                      </button>
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

      {/* ====== SECTION 2: Request Restock Gudang ke Admin ====== */}
      <div className="reqSection">
        <div className="reqTitleRow">
          <div className="reqTitle">Request Restock Gudang ke Admin</div>
          <div className="reqMeta">
            Total: {restockStats.total} • Pending: {restockStats.pending}
          </div>
        </div>

        <div className="reqActionsRow">
          <button className="pageAdmin__btnSmall" onClick={openRestockModal}>
            Buat Request
          </button>
        </div>

        <div className="reqTable">
          <div
            className="reqTableHead"
            style={{ gridTemplateColumns: "120px 1.2fr 120px 140px 140px 170px" }}
          >
            <div>ID</div>
            <div>Items</div>
            <div>Total</div>
            <div>Decision</div>
            <div>Status</div>
            <div>Aksi</div>
          </div>

          {restockToAdmin.length === 0 ? (
            <div className="reqEmpty">Belum ada request restock gudang.</div>
          ) : (
            restockToAdmin.map((r) => {
              const total = (r.items || []).reduce(
                (sum, it) => sum + Number(it.qty ?? it.jumlah ?? 0),
                0
              );

              const status = (r.status || "").toLowerCase();
              const decision = (r.decision || "").toLowerCase();

              // skema:
              // - admin accept -> gudang lihat accepted + tombol "Selesai"
              const canFinish =
                decision === "approved" ||
                decision === "accepted" ||
                status.includes("processing") ||
                status.includes("proses") ||
                status.includes("accepted");

              const done = status.includes("selesai") || status.includes("done");

              return (
                <div
                  key={r.id}
                  className="reqTableRow"
                  style={{ gridTemplateColumns: "120px 1.2fr 120px 140px 140px 170px" }}
                >
                  <div className="reqId">{r.id}</div>
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
                    {canFinish && !done ? (
                      <button className="pageAdmin__btnSmall" onClick={() => openProofModal(r.id)}>
                        Selesai
                      </button>
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

      {/* ===== Modal BUAT REQUEST RESTOCK ===== */}
      {restockOpen && (
        <div className="reqModalOverlay" onClick={() => setRestockOpen(false)}>
          <div className="reqModal" onClick={(e) => e.stopPropagation()}>
            <div className="reqModalHead">
              <div className="reqModalTitle">Buat Request Restock ke Admin</div>
              <button className="reqModalClose" onClick={() => setRestockOpen(false)}>
                ✕
              </button>
            </div>

            <div className="reqModalBody">
              <div style={{ fontWeight: 900, marginBottom: 10 }}>
                Isi barang yang stoknya menipis/habis
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {restockItems.map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 0.7fr auto",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <input
                      value={row.code}
                      onChange={(e) => updateRestockRow(idx, "code", e.target.value)}
                      placeholder="Kode barang (contoh: BRG-002)"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: "1px solid rgba(0,0,0,0.12)",
                        background: "rgba(255,255,255,0.45)",
                        fontWeight: 800,
                        outline: "none",
                      }}
                    />

                    <input
                      value={row.qty}
                      onChange={(e) => updateRestockRow(idx, "qty", e.target.value)}
                      placeholder="Qty"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: "1px solid rgba(0,0,0,0.12)",
                        background: "rgba(255,255,255,0.45)",
                        fontWeight: 800,
                        outline: "none",
                      }}
                    />

                    <button
                      className="pageAdmin__btnSmall isGhost"
                      onClick={() => removeRestockRow(idx)}
                      disabled={restockItems.length === 1}
                      title="Hapus baris"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                <button className="pageAdmin__btnSmall isGhost" onClick={addRestockRow}>
                  + Tambah Item
                </button>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 850, marginBottom: 8 }}>Catatan (opsional)</div>
                <input
                  value={restockNote}
                  onChange={(e) => setRestockNote(e.target.value)}
                  placeholder="Contoh: BRG-002 habis, butuh segera"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 14,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "rgba(255,255,255,0.45)",
                    fontWeight: 800,
                    outline: "none",
                  }}
                />
              </div>

              {!canSubmitRestock && (
                <div style={{ marginTop: 12, color: "rgba(0,0,0,0.6)", fontWeight: 800 }}>
                  * Minimal isi 1 item (kode + qty &gt; 0).
                </div>
              )}
            </div>

            <div className="reqModalFooter">
              <button className="pageAdmin__btnSmall isGhost" onClick={() => setRestockOpen(false)}>
                Batal
              </button>
              <button className="pageAdmin__btnSmall" disabled={!canSubmitRestock} onClick={submitRestockToAdmin}>
                Kirim Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal upload bukti restock (SELESAI) ===== */}
      {proofOpen && (
        <div className="reqModalOverlay" onClick={() => setProofOpen(false)}>
          <div className="reqModal" onClick={(e) => e.stopPropagation()}>
            <div className="reqModalHead">
              <div className="reqModalTitle">Upload Bukti Restock</div>
              <button className="reqModalClose" onClick={() => setProofOpen(false)}>
                ✕
              </button>
            </div>

            <div className="reqModalBody">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const b64 = await fileToBase64(f);
                  setProofBase64(b64);
                }}
              />

              {proofBase64 && (
                <img
                  src={proofBase64}
                  alt="preview"
                  style={{ width: "100%", marginTop: 12, borderRadius: 14 }}
                />
              )}
            </div>

            <div className="reqModalFooter">
              <button className="pageAdmin__btnSmall isGhost" onClick={() => setProofOpen(false)}>
                Batal
              </button>
              <button className="pageAdmin__btnSmall" disabled={!proofBase64} onClick={submitProof}>
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
