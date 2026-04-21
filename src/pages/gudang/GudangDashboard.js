import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./GudangDashboard.css";

import Card from "../../components/common/Card";
import bg from "../../assets/images/BgDashboard.avif";
import stokImg from "../../assets/images/stok.jpg";
import bgCardGudang from "../../assets/images/bgCardGudang.jpg";
import bgCardToko from "../../assets/images/bgCardToko.jpg";

import logo from "../../assets/images/logo.png";
import logoLight from "../../assets/images/logoLight.png";

export default function GudangDashboard() {
  const { featuresRef } = useOutletContext();
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || "warm");

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => setTheme(root.dataset.theme || "warm");
    updateTheme();
    const obs = new MutationObserver(() => updateTheme());
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const currentLogo = theme === "dark" ? logoLight : logo;

  const stats = [
    { label: "Stok Gudang", value: "1,860 barang", status: "Aman", tone: "ok" },
    { label: "Request Masuk", value: "12 hari ini", status: "Butuh proses", tone: "warn" },
    { label: "Pengiriman", value: "3 berjalan", status: "Dipantau", tone: "neutral" },
  ];

  return (
    <div className="gudang">
      {/* HERO */}
      <section className="gudang__hero" style={{ backgroundImage: `url(${bg})` }}>
        <div className="gudang__heroInner gudang__heroInner--center">
          <motion.h1
            className="gudang__title"
            initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            Selamat Datang,
            <br />
            Gudang!
          </motion.h1>

          <div className="gudang__stats">
            {stats.map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.12 + idx * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
              >
                <Card className="gudang__statCard gudang__statCard--dark">
                  <div className="gudang__statLabel">{s.label}</div>
                  <div className="gudang__statValue">{s.value}</div>
                  <div className={`gudang__statStatus gudang__statStatus--${s.tone}`}>
                    {s.status}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="gudang__middle">
        <div className="gudang__middleHeader">
          <div className="gudang__middleHeaderLeft">Operasional Gudang</div>

          <div className="gudang__middleHeaderRight">
            <div className="gudang__middleHeaderTitle">
              Proses request toko lebih cepat,
              <br />
              monitoring stok lebih rapi,
              <br />
              dan update data real-time.
            </div>
            <div className="gudang__middleHeaderSub">Aksi cepat gudang</div>
          </div>
        </div>

        <div className="gudang__divider" />

        <div className="gudang__cards">
          <Link to="/gudang/requests" className="gudang__navCard gudang__navCard--big">
            <img src={stokImg} alt="Request Masuk" />
            <div className="gudang__overlay">
              <div className="gudang__overlayText">Requests Masuk</div>
            </div>
          </Link>

          <div className="gudang__row">
            <Link to="/gudang/stok" className="gudang__navCard">
              <img src={bgCardGudang} alt="Stok Gudang" />
              <div className="gudang__overlay">
                <div className="gudang__overlayText">Stok Gudang</div>
              </div>
            </Link>

            <Link to="/gudang/pengiriman" className="gudang__navCard">
              <img src={bgCardToko} alt="Pengiriman" />
              <div className="gudang__overlay">
                <div className="gudang__overlayText">Pengiriman</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="gudang__brand">
          <img className="gudang__brandLogo" src={currentLogo} alt="ReaStock" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="gudang__bottom" ref={featuresRef}>
        <div className="gudang__bottomHeader">Features/</div>

        <div className="gudang__features">
          <Card className="gudang__featureCard">
            <div className="gudang__featureTitle">Requests</div>
            <div className="gudang__featureText">
              Lihat request masuk, proses, dan ubah status tanpa tunggu update manual.
            </div>
          </Card>

          <Card className="gudang__featureCard gudang__featureCard--center">
            <div className="gudang__featureTitle">Realtime Sync</div>
            <div className="gudang__featureText">
              Simulasi sinkronisasi data agar stok selalu update saat ada perubahan.
            </div>
          </Card>

          <Card className="gudang__featureCard">
            <div className="gudang__featureTitle">Alerts</div>
            <div className="gudang__featureText">
              Notifikasi stok menipis dan request baru untuk mempercepat respon gudang.
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
