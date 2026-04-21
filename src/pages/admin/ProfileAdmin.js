import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/common/Card";
import "./PageAdmin.css";

export default function ProfileAdmin() {
  const easing = useMemo(() => [0.22, 1, 0.36, 1], []);
  const [notifStock, setNotifStock] = useState(true);
  const [notifRequests, setNotifRequests] = useState(true);

  const stats = [
    { label: "Requests Baru", value: "12", sub: "Hari ini" },
    { label: "Stok Menipis", value: "5", sub: "Butuh perhatian" },
    { label: "Sinkronisasi", value: "Aktif", sub: "Realtime" },
  ];

  const activities = [
    { time: "10:12", text: "Request REQ-014 masuk dari Toko A" },
    { time: "09:40", text: "Stok Barang BRG-002 menipis (Gudang)" },
    { time: "Kemarin", text: "Update profil admin" },
  ];

  return (
    <div className="pageAdmin pageAdmin--wide">
      {/* Header */}
      <motion.div
        className="profileHero"
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: easing }}
      >
        <div className="profileHero__left">
          <div className="profileHero__avatar">A</div>

          <div className="profileHero__meta">
            <div className="profileHero__titleRow">
              <h1 className="profileHero__title">Profile Admin</h1>
              <span className="profileHero__badge">ADMIN</span>
              <span className="profileHero__status">
                <span className="profileHero__dot" />
                Online
              </span>
            </div>

            <p className="profileHero__subtitle">
              Kelola informasi akun, preferensi notifikasi, dan ringkasan aktivitas terbaru.
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
          {stats.map((s, idx) => (
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

      {/* Content grid */}
      <motion.div
        className="profileGrid"
        initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.06, duration: 0.55, ease: easing }}
      >
        {/* Akun */}
        <Card className="profileCard">
          <div className="profileCard__head">
            <h3>Data Akun</h3>
            <span className="profileCard__hint">Informasi dasar pengguna</span>
          </div>

          <div className="profileRows">
            <div className="profileRow">
              <span>Nama</span>
              <b>Admin</b>
            </div>
            <div className="profileRow">
              <span>Email</span>
              <b>admin@gmail.com</b>
            </div>
            <div className="profileRow">
              <span>Role</span>
              <b>Admin</b>
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

        {/* Preferensi */}
        <Card className="profileCard">
          <div className="profileCard__head">
            <h3>Preferensi</h3>
            <span className="profileCard__hint">Pengaturan cepat untuk admin</span>
          </div>

          <div className="prefList">
            <label className="prefItem">
              <div className="prefItem__text">
                <div className="prefItem__title">Notifikasi stok menipis</div>
                <div className="prefItem__sub">Muncul ketika stok gudang/toko melewati batas minimum</div>
              </div>

              <span className={`toggle ${notifStock ? "is-on" : ""}`}>
                <input
                  type="checkbox"
                  checked={notifStock}
                  onChange={(e) => setNotifStock(e.target.checked)}
                  aria-label="Toggle notifikasi stok menipis"
                />
                <span className="toggle__knob" />
              </span>
            </label>

            <label className="prefItem">
              <div className="prefItem__text">
                <div className="prefItem__title">Notifikasi request masuk</div>
                <div className="prefItem__sub">Muncul saat toko mengirim permintaan barang</div>
              </div>

              <span className={`toggle ${notifRequests ? "is-on" : ""}`}>
                <input
                  type="checkbox"
                  checked={notifRequests}
                  onChange={(e) => setNotifRequests(e.target.checked)}
                  aria-label="Toggle notifikasi request masuk"
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

        {/* Aktivitas */}
        <Card className="profileCard profileCard--full">
          <div className="profileCard__head">
            <h3>Aktivitas Terbaru</h3>
            <span className="profileCard__hint">Log ringkas untuk monitoring</span>
          </div>

          <div className="activityList">
            {activities.map((a, i) => (
              <motion.div
                key={i}
                className="activityItem"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease: easing }}
              >
                <div className="activityItem__time">{a.time}</div>
                <div className="activityItem__text">{a.text}</div>
                <button className="activityItem__btn" type="button">
                  Detail
                </button>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
