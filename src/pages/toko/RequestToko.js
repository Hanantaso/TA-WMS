// src/pages/toko/RequestToko.js
import React, { useEffect, useMemo, useState } from "react";
import "../admin/PageAdmin.css";
import { useNavigate } from "react-router-dom";
import {
  createTokoRequest,
  subscribeRequests,
  tokoSelesaiTerima,
} from "../../services/wmsApi";

const pillClassByStatus = (status) => {
  const s = (status || "").toLowerCase();
  if (!s) return "pageAdmin__pill isPending";

  if (s.includes("menunggu")) return "pageAdmin__pill isPending";
  if (s.includes("pending")) return "pageAdmin__pill isPending";
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
  if (d === "accepted") return "pageAdmin__pill isAccepted";
  if (d === "declined") return "pageAdmin__pill isDeclined";
  return "pageAdmin__pill";
};

export default function RequestToko() {
  const navigate = useNavigate();

  const [allReq, setAllReq] = useState([]);

  // form sederhana (sesuai UI kamu saat ini)
  const [kode, setKode] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    const unsub = subscribeRequests((rows) => setAllReq(rows || []));
    return () => typeof unsub === "function" && unsub();
  }, []);

  const tokoReq = useMemo(() => {
    // request yang dibuat toko (toko -> gudang)
    return allReq.filter((r) => (r.fromRole || "").toLowerCase() === "toko");
  }, [allReq]);

  const sendRequest = async () => {
    if (!kode || !jumlah) return;

    await createTokoRequest({
      fromName: "Toko",
      items: [{ code: kode, qty: Number(jumlah) || 0 }],
      note: catatan,
    });

    setKode("");
    setJumlah("");
    setCatatan("");
  };

  const lihatPengiriman = (id) => {
    navigate(`/toko/pengiriman/${id}`);
  };

  const selesaiTerima = async (id) => {
    await tokoSelesaiTerima(id);
  };

  return (
    <div className="pageAdmin">
      <div className="pageAdmin__head">
        <div>
          <div className="pageAdmin__title">Requests</div>
          <div className="pageAdmin__sub">
            Kirim request stok ke gudang. ACC dilakukan oleh gudang.
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="reqSection">
        <div className="reqTitleRow">
          <div className="reqTitle">Buat Request Baru</div>
          <div className="reqMeta">Isi kode barang dan jumlah</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginTop: 10,
          }}
        >
          <div>
            <div style={{ fontWeight: 850, marginBottom: 8 }}>Kode Barang</div>
            <input
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              placeholder="Contoh: BRG-002"
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

          <div>
            <div style={{ fontWeight: 850, marginBottom: 8 }}>Jumlah</div>
            <input
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              placeholder="Contoh: 12"
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

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontWeight: 850, marginBottom: 8 }}>Catatan (opsional)</div>
            <input
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: untuk promo weekend"
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

          <div style={{ gridColumn: "1 / -1", marginTop: 6 }}>
            <button className="pageAdmin__btnPrimary" onClick={sendRequest}>
              Kirim Request
            </button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="reqSection">
        <div className="reqTitleRow">
          <div className="reqTitle">Daftar Request</div>
          <div className="reqMeta">Riwayat request toko</div>
        </div>

        <div className="reqTable">
          <div
            className="reqTableHead"
            style={{ gridTemplateColumns: "120px 140px 1.2fr 140px 140px 170px" }}
          >
            <div>ID</div>
            <div>Tanggal</div>
            <div>Items / Catatan</div>
            <div>Decision</div>
            <div>Status</div>
            <div>Aksi</div>
          </div>

          {tokoReq.length === 0 ? (
            <div className="reqEmpty">Belum ada request.</div>
          ) : (
            tokoReq.map((r) => {
              const date = (r.createdAt || "").split("T")[0] || "-";
              const item = r.items?.[0];
              const itemText = item ? `${item.code} (${item.qty})` : "-";

              const status = (r.status || "").toLowerCase();
              const canSeeTrack = status.includes("mengirim");
              const canFinish = status.includes("mengirim"); // sesuai skema: setelah mengirim, toko bisa selesai
              const done = status.includes("selesai");

              return (
                <div
                  key={r.id}
                  className="reqTableRow"
                  style={{ gridTemplateColumns: "120px 140px 1.2fr 140px 140px 170px" }}
                >
                  <div className="reqId">{r.id}</div>
                  <div className="reqFrom">{date}</div>

                  <div className="reqItems">
                    <div style={{ fontWeight: 900 }}>{itemText}</div>
                    <div className="pageAdmin__muted" style={{ marginTop: 6 }}>
                      {r.note || "-"}
                    </div>
                  </div>

                  <div>
                    <span className={pillClassByDecision(r.decision)}>
                      {r.decision ? r.decision : "Pending"}
                    </span>
                  </div>

                  <div>
                    <span className={pillClassByStatus(r.status)}>{r.status || "-"}</span>
                  </div>

                  <div className="reqActions">
                    {done ? (
                      <span className="reqMuted">-</span>
                    ) : (
                      <>
                        {canSeeTrack && (
                          <button
                            className="pageAdmin__btnSmall isGhost"
                            onClick={() => lihatPengiriman(r.id)}
                          >
                            Lihat Pengiriman
                          </button>
                        )}
                        {canFinish && (
                          <button className="pageAdmin__btnSmall" onClick={() => selesaiTerima(r.id)}>
                            Selesai
                          </button>
                        )}
                        {!canSeeTrack && !canFinish && <span className="reqMuted">-</span>}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 760px){
          .reqSection > div[style*="grid-template-columns: 1fr 1fr"]{
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
