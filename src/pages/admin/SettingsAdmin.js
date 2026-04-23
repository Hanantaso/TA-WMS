import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../app/ThemeProvider";
import "./PageAdmin.css";

export default function SettingsAdmin() {
  const easing = useMemo(() => [0.22, 1, 0.36, 1], []);
  const [saved, setSaved] = useState(false);

  const [notifStock, setNotifStock] = useState(true);
  const [notifRequests, setNotifRequests] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState("5");
  const [syncStatus, setSyncStatus] = useState("Connected (dummy)");
  const { theme, setTheme } = useTheme();
  const [compact, setCompact] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setNotifStock(true);
    setNotifRequests(true);
    setAutoSync(true);
    setSyncInterval("5");
    setTheme("warm");
    setCompact(false);
  };

  const testRealtime = () => {
    setSyncStatus("Testing...");
    setTimeout(() => setSyncStatus("Connected (dummy)"), 1500);
  };

  return (
    <div className="settings-page">
      {/* HEADER */}
      <header className="settings-header">
        <div className="header-info">
          <h1>Pengaturan Sistem</h1>
          <p>Kelola pengaturan aplikasi untuk notifikasi, sinkronisasi, dan tampilan.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleSave}>
            {saved ? "Tersimpan ✓" : "Simpan Perubahan"}
          </button>
          <button className="btn-outline" onClick={handleReset}>
            <span>🔄</span> Reset
          </button>
        </div>
      </header>

      <div className="settings-grid">
        {/* NOTIFIKASI */}
        <section className="settings-card">
          <div className="card-header">
            <div className="card-icon-title">
              <span className="card-icon-bg">🔔</span>
              <div className="title-text">
                <h3>Notifikasi</h3>
                <p>Atur notifikasi penting untuk admin.</p>
              </div>
            </div>
            <span className="card-pill">Alerts</span>
          </div>

          <div className="settings-row-modern">
            <div className="row-text">
              <strong>Stok menipis</strong>
              <span>Tampil saat stok gudang/toko melewati batas minimum.</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={notifStock} onChange={(e) => setNotifStock(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-row-modern">
            <div className="row-text">
              <strong>Permintaan barang</strong>
              <span>Tampil saat toko mengirim request kebutuhan barang.</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={notifRequests} onChange={(e) => setNotifRequests(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        {/* SINKRONISASI */}
        <section className="settings-card">
          <div className="card-header">
            <div className="card-icon-title">
              <span className="card-icon-bg">🔄</span>
              <div className="title-text">
                <h3>Sinkronisasi</h3>
                <p>Kontrol data realtime dan interval sinkronisasi aplikasi.</p>
              </div>
            </div>
            <span className="card-pill">Realtime</span>
          </div>

          <div className="settings-row-modern">
            <div className="row-text">
              <strong>Auto Sync</strong>
              <span>Sinkronisasi otomatis agar stok selalu update.</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={autoSync} onChange={(e) => setAutoSync(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="sync-controls">
            <div className="control-group">
              <label>Interval Sync</label>
              <p className="hint">berapa menit sekali (dummy)</p>
              <select className="modern-select" value={syncInterval} onChange={(e) => setSyncInterval(e.target.value)} disabled={!autoSync}>
                <option value="1">1 menit</option>
                <option value="5">5 menit</option>
                <option value="10">10 menit</option>
              </select>
            </div>
            <div className="control-group">
              <label>Status</label>
              <p className="hint">contoh status koneksi realtime</p>
              <div className={`status-display ${syncStatus === "Testing..." ? "testing" : "connected"}`}>
                <span className="dot"></span> {syncStatus}
              </div>
            </div>
          </div>

          <button className="btn-wide-light" onClick={testRealtime}>
            <span>📶</span> Tes Realtime
          </button>
        </section>

        {/* TAMPILAN */}
        <section className="settings-card full-width">
          <div className="card-header">
            <div className="card-icon-title">
              <span className="card-icon-bg">🎨</span>
              <div className="title-text">
                <h3>Tampilan</h3>
                <p>Pilih tema dan atur tampilan sesuai preferensi.</p>
              </div>
            </div>
            <span className="card-pill">UI</span>
          </div>

          <div className="theme-selector-section">
            <label className="section-label">Theme</label>
            <p className="hint">Pilih mode tampilan aplikasi</p>
            
            <div className="theme-options">
              {["warm", "light", "dark"].map((t) => (
                <div 
                  key={t} 
                  className={`theme-option-card ${theme === t ? "active" : ""}`}
                  onClick={() => setTheme(t)}
                >
                  <div className={`theme-preview ${t}`}>
                    <span></span><span></span><span></span>
                  </div>
                  <div className="theme-info">
                    <strong>{t.charAt(0).toUpperCase() + t.slice(1)}</strong>
                    <p>{t === "warm" ? "Nuansa hangat, lembut, dan natural." : t === "light" ? "Tampilan cerah, bersih, dan ringan." : "Mode gelap yang fokus dan elegan."}</p>
                  </div>
                  <div className="check-badge">{theme === t && "✓"}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="settings-row-modern mt-32">
            <div className="row-text">
              <strong>Compact Mode</strong>
              <span>Tampilan lebih rapat untuk layar kecil.</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}