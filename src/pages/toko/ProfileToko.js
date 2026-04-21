import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/common/Card";
import "../admin/PageAdmin.css";

export default function ProfileToko() {
  const easing = useMemo(() => [0.22, 1, 0.36, 1], []);

  const [notifStock, setNotifStock] = useState(true);
  const [notifRequests, setNotifRequests] = useState(true);

  const stats = [
    { label: "Requests Baru", value: "12", sub: "Hari ini" },
    { label: "Stok Menipis", value: "5", sub: "Butuh perhatian" },
    { label: "Sinkronisasi", value: "Aktif", sub: "Realtime" },
  ];

  const activities = [
    { time: "10:12", text: "Request REQ-014 dibuat untuk Gudang" },
    { time: "09:40", text: "Stok BRG-002 menipis (Toko)" },
    { time: "Kemarin", text: "Cek status pengiriman" },
  ];

  return (
    <div className="pageAdmin pageAdmin--wide">
      <motion.div
        className="profileHero"
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: easing }}
      >
        <div className="profileHero__left">
          <div className="profileHero__avatar">T</div>

          <div className="profileHero__meta">
            <div className="profileHero__titleRow">
              {/* ✅ FIX: bukan Gudang */}
              <h1 className="profileHero__title">Profile Toko</h1>
              <span className="profileHero__badge">TOKO</span>

              <span className="profileHero__status">
                <span className="profileHero__dot" />
                Online
              </span>
            </div>

            {/* ✅ FIX: subtitle toko */}
            <p className="profileHero__subtitle">
              Kelola informasi akun toko, preferensi notifikasi, dan aktivitas operasional.
            </p>

            <div className="profileHero__quick">
              <button className="profileBtn profileBtn--primary" type="button">
                Edit Profil
              </button>
              <button className="profileBtn" type="button">
                Ubah Password
              </button>
              <button className="profileBtn profileBtn--ghost" type="button">
                Lihat Aktivitas
              </button>
            </div>
          </div>
        </div>

        <div className="profileHero__right">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.18, ease: easing }}
            >
              <Card className="profileStat">
                <div className="profileStat__label">{s.label}</div>
                <div className="profileStat__value">{s.value}</div>
                <div className="profileStat__sub">{s.sub}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="profileGrid"
        initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.06, duration: 0.55, ease: easing }}
      >
        <Card className="profileCard">
          <div className="profileCard__head">
            <h3>Data Akun</h3>
            <span className="profileCard__hint">Informasi dasar pengguna</span>
          </div>

          <div className="profileRows">
            <div className="profileRow">
              <span>Nama</span>
              <b>Toko</b>
            </div>

            {/* ✅ FIX: email toko */}
            <div className="profileRow">
              <span>Email</span>
              <b>toko@gmail.com</b>
            </div>

            {/* ✅ FIX: role toko */}
            <div className="profileRow">
              <span>Role</span>
              <b>Toko</b>
            </div>

            <div className="profileRow">
              <span>Terakhir Login</span>
              <b>Hari ini</b>
            </div>
          </div>

          <div className="profileActions">
            <button className="profileBtn profileBtn--primary" type="button">
              Simpan Perubahan
            </button>
            <button className="profileBtn profileBtn--ghost" type="button">
              Batalkan
            </button>
          </div>
        </Card>

        <Card className="profileCard">
          <div className="profileCard__head">
            <h3>Preferensi</h3>
            <span className="profileCard__hint">Pengaturan cepat</span>
          </div>

          <div className="prefList">
            <label className="prefItem">
              <div className="prefItem__text">
                <div className="prefItem__title">Notifikasi stok menipis</div>
                <div className="prefItem__sub">
                  Muncul ketika stok toko melewati batas minimum
                </div>
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

            <label className="prefItem">
              <div className="prefItem__text">
                <div className="prefItem__title">Notifikasi status permintaan</div>
                <div className="prefItem__sub">
                  Muncul saat status request/pengiriman berubah
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

            <div className="prefDivider" />

            <div className="prefCTA">
              <button className="profileBtn profileBtn--primary" type="button">
                Terapkan
              </button>
              <button className="profileBtn" type="button">
                Reset
              </button>
            </div>
          </div>
        </Card>

        <Card className="profileCard profileCard--span2">
          <div className="profileCard__head">
            <h3>Aktivitas Terbaru</h3>
            <span className="profileCard__hint">Log ringkas untuk monitoring</span>
          </div>

          <div className="activityList">
            {activities.map((a, idx) => (
              <motion.div
                key={idx}
                className="activityItem"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + idx * 0.04, duration: 0.35, ease: easing }}
              >
                <span className="activityTime">{a.time}</span>
                <span className="activityText">{a.text}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
