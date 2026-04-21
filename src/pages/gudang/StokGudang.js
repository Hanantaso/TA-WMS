// src/pages/gudang/StokGudang.js
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../shared/PageCommon.css";
import { subscribeWarehouseStock } from "../../services/wmsApi";

function getStockStatus(qty, min) {
  if (qty <= 0) return { label: "Restok", cls: "pill pill-danger" };
  if (qty <= min) return { label: "Tipis", clscls: "pill pill-warning", cls: "pill pill-warning" };
  return { label: "Aman", cls: "pill pill-success" };
}

export default function StokGudang() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsub = subscribeWarehouseStock(setItems);
    return () => unsub?.();
  }, []);

  const summary = useMemo(() => {
    const total = items.reduce((a, b) => a + (b.qty || 0), 0);
    const tipis = items.filter((i) => (i.qty || 0) <= (i.min || 0)).length;
    return { totalItems: items.length, totalQty: total, tipis };
  }, [items]);

  return (
    <div className="page">
      <h1 className="pageTitle">Stok Gudang</h1>
      <p className="pageSubtitle">Monitoring stok barang gudang (prototype).</p>

      <div className="pageGrid2">
        <div className="panel">
          <h3 className="panelTitle">Ringkasan</h3>
          <div className="panelRow">
            <span>Total jenis barang</span>
            <b>{summary.totalItems}</b>
          </div>
          <div className="panelRow">
            <span>Total qty</span>
            <b>{summary.totalQty}</b>
          </div>
          <div className="panelRow">
            <span>Stok menipis</span>
            <b>{summary.tipis}</b>
          </div>

          <div className="panelActions">
            <button
              className="btnPrimary"
              onClick={() => navigate("/gudang/requests")}
              type="button"
            >
              Request
            </button>
          </div>
        </div>

        <div className="panel">
          <h3 className="panelTitle">Sinkronisasi</h3>
          <p className="muted">Rekap update terakhir (dummy).</p>
          <button className="btnGhost" type="button">
            Refresh
          </button>
        </div>
      </div>

      <div className="stockGrid">
        {items.map((it) => {
          const s = getStockStatus(it.qty, it.min);
          return (
            <div className="stockCard" key={it.code}>
              <div className="stockImageWrap">
                <img
                  className="stockImage"
                  src={it.image}
                  alt={it.name}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="stockInfo">
                <div className="stockTop">
                  <div>
                    <div className="stockName">{it.name}</div>
                    <div className="stockMeta">
                      <span>Kode:</span> <b>{it.code}</b>
                      <span className="dot">•</span>
                      <span>Jenis:</span> <b>{it.type}</b>
                    </div>
                  </div>
                  <span className={s.cls}>{s.label}</span>
                </div>

                <div className="stockBottom">
                  <div className="stockQty">
                    <span>Stok</span>
                    <b>{it.qty}</b>
                  </div>
                  <div className="stockQty">
                    <span>Minimum</span>
                    <b>{it.min}</b>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="emptyState">Belum ada data stok.</div>
        )}
      </div>
    </div>
  );
}
