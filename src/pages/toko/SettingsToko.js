import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/common/Card";
import "../admin/PageAdmin.css";
import { useTheme } from "../../app/ThemeProvider";

export default function SettingsToko() {
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
    setTimeout(() => setSaved(false), 1200);
  };

  const testRealtime = () => {
    setSyncStatus("Testing.");
    setTimeout(() => setSyncStatus("Connected (dummy)"), 900);
  };

  return (
    <div className="pageAdmin pageAdmin--wide">
      <motion.div
        className="settingsHero"
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: easing }}
      >
        <div className="settingsHero__titleWrap">
          <h1 className="settingsHero__title">Settings Toko</h1>
          <p className="settingsHero__subtitle">
            Pengaturan toko (tema, notifikasi, sinkronisasi).
          </p>
        </div>

        <div className="settingsHero__actions">
          <button className="settingsBtn settingsBtn--primary" type="button" onClick={handleSave}>
            Simpan
          </button>
          <button className="settingsBtn" type="button" onClick={() => window.location.reload()}>
            Reset
          </button>

          <motion.div
            className={`settingsSaved ${saved ? "is-on" : ""}`}
            initial={false}
            animate={{ opacity: saved ? 1 : 0, y: saved ? 0 : 6 }}
            transition={{ duration: 0.22, ease: easing }}
          >
            Tersimpan ✓
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="settingsGrid"
        initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.06, duration: 0.55, ease: easing }}
      >
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: easing }}>
          <Card className="settingsCard">
            <div className="settingsCard__head">
              <div>
                <h3>Notifikasi</h3>
                <span className="settingsHint">Notifikasi untuk operasional toko.</span>
              </div>
              <span className="settingsPill">Alerts</span>
            </div>

            <div className="settingsList">
              <label className="settingsItem">
                <div className="settingsItem__text">
                  <div className="settingsItem__title">Stok menipis</div>
                  <div className="settingsItem__sub">Tampil saat stok melewati batas minimum.</div>
                </div>
                <span className={`toggle ${notifStock ? "is-on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={notifStock}
                    onChange={(e) => setNotifStock(e.target.checked)}
                  />
                  <span className="toggle__knob" />
                </span>
              </label>

              <label className="settingsItem">
                <div className="settingsItem__text">
                  <div className="settingsItem__title">Status permintaan</div>
                  <div className="settingsItem__sub">
                    Tampil saat status permintaan/pengiriman berubah.
                  </div>
                </div>
                <span className={`toggle ${notifRequests ? "is-on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={notifRequests}
                    onChange={(e) => setNotifRequests(e.target.checked)}
                  />
                  <span className="toggle__knob" />
                </span>
              </label>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: easing }}>
          <Card className="settingsCard">
            <div className="settingsCard__head">
              <div>
                <h3>Sinkronisasi</h3>
                <span className="settingsHint">Kontrol realtime / interval sync.</span>
              </div>
              <span className="settingsPill settingsPill--on">Realtime</span>
            </div>

            <div className="settingsList">
              <label className="settingsItem">
                <div className="settingsItem__text">
                  <div className="settingsItem__title">Auto Sync</div>
                  <div className="settingsItem__sub">Sinkronisasi otomatis agar data selalu update.</div>
                </div>
                <span className={`toggle ${autoSync ? "is-on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                  />
                  <span className="toggle__knob" />
                </span>
              </label>

              <div className="settingsItem settingsItem--row">
                <div className="settingsItem__text">
                  <div className="settingsItem__title">Interval Sync</div>
                  <div className="settingsItem__sub">berapa menit sekali (dummy)</div>
                </div>

                <select
                  className="settingsSelect"
                  value={syncInterval}
                  onChange={(e) => setSyncInterval(e.target.value)}
                >
                  <option value="1">1 menit</option>
                  <option value="5">5 menit</option>
                  <option value="10">10 menit</option>
                  <option value="30">30 menit</option>
                </select>
              </div>

              <div className="settingsItem settingsItem--row">
                <div className="settingsItem__text">
                  <div className="settingsItem__title">Status</div>
                  <div className="settingsItem__sub">contoh status koneksi realtime</div>
                </div>

                <div className="settingsStatus">
                  <span className="settingsDot is-on" />
                  <b>{syncStatus}</b>
                </div>
              </div>

              <button className="settingsBtn settingsBtn--full" type="button" onClick={testRealtime}>
                Tes Realtime
              </button>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: easing }}>
          <Card className="settingsCard">
            <div className="settingsCard__head">
              <div>
                <h3>Tampilan</h3>
                <span className="settingsHint">Tema & kepadatan tampilan.</span>
              </div>
              <span className="settingsPill">UI</span>
            </div>

            <div className="settingsList">
              <div className="settingsItem settingsItem--row">
                <div className="settingsItem__text">
                  <div className="settingsItem__title">Theme</div>
                  <div className="settingsItem__sub">pilih mode tampilan (dummy)</div>
                </div>

                <div className="themeSwitch">
                  <button
                    type="button"
                    className={`themeChip ${theme === "warm" ? "is-on" : ""}`}
                    onClick={() => setTheme("warm")}
                  >
                    warm
                  </button>
                  <button
                    type="button"
                    className={`themeChip ${theme === "light" ? "is-on" : ""}`}
                    onClick={() => setTheme("light")}
                  >
                    light
                  </button>
                  <button
                    type="button"
                    className={`themeChip ${theme === "dark" ? "is-on" : ""}`}
                    onClick={() => setTheme("dark")}
                  >
                    dark
                  </button>
                </div>
              </div>

              <label className="settingsItem">
                <div className="settingsItem__text">
                  <div className="settingsItem__title">Compact mode</div>
                  <div className="settingsItem__sub">Tampilan lebih rapat untuk layar kecil.</div>
                </div>
                <span className={`toggle ${compact ? "is-on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={compact}
                    onChange={(e) => setCompact(e.target.checked)}
                  />
                  <span className="toggle__knob" />
                </span>
              </label>

              <div className="settingsNote">
                * Ini dummy UI dulu. Nanti kamu bisa simpan ke database atau localStorage.
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
