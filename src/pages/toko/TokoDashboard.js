import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./TokoDashboard.css";

import Card from "../../components/common/Card";
import bg from "../../assets/images/BgDashboard.avif";
import bgCardToko from "../../assets/images/bgCardToko.jpg";
import bgCardGudang from "../../assets/images/bgCardGudang.jpg";
import stokImg from "../../assets/images/stok.jpg";

import logo from "../../assets/images/logo.png";
import logoLight from "../../assets/images/logoLight.png";

export default function TokoDashboard() {
  const { featuresRef } = useOutletContext();

  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "warm"
  );

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
    { label: "Stok Toko", value: "224 barang", status: "Perlu monitor", tone: "neutral" },
    { label: "Request Aktif", value: "3 request", status: "Diproses gudang", tone: "warn" },
    { label: "Sinkronisasi", value: "Aktif", status: "Realtime/Auto", tone: "ok" },
  ];

  return (
    <div className="toko">
      {/* HERO */}
      <section className="toko__hero" style={{ backgroundImage: `url(${bg})` }}>
        <div className="toko__heroInner toko__heroInner--center">
          <motion.h1
            className="toko__title"
            initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            Selamat Datang,
            <br />
            Toko!
          </motion.h1>

          <div className="toko__stats">
            {stats.map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 0.12 + idx * 0.08,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4 }}
              >
                <Card className="toko__statCard toko__statCard--dark">
                  <div className="toko__statLabel">{s.label}</div>
                  <div className="toko__statValue">{s.value}</div>
                  <div className={`toko__statStatus toko__statStatus--${s.tone}`}>
                    {s.status}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <section className="toko__middle">
        <div className="toko__middleHeader">
          <div className="toko__middleHeaderLeft">Operasional Toko</div>

          <div className="toko__middleHeaderRight">
            <div className="toko__middleHeaderTitle">
              Buat request barang ke gudang,
              <br />
              pantau stok toko,
              <br />
              dan lihat status pemrosesan.
            </div>
            <div className="toko__middleHeaderSub">Aksi cepat toko</div>
          </div>
        </div>

        <div className="toko__divider" />

        <div className="toko__cards">
          <Link to="/toko/request" className="toko__navCard toko__navCard--big">
            <img src={stokImg} alt="Buat Request Barang" />
            <div className="toko__overlay">
              <div className="toko__overlayText">Buat Request Barang</div>
            </div>
          </Link>

          <div className="toko__row">
            <Link to="/toko/stok" className="toko__navCard">
              <img src={bgCardToko} alt="Stok Toko" />
              <div className="toko__overlay">
                <div className="toko__overlayText">Stok Toko</div>
              </div>
            </Link>

            <Link to="/toko/riwayat" className="toko__navCard">
              <img src={bgCardGudang} alt="Riwayat Request" />
              <div className="toko__overlay">
                <div className="toko__overlayText">Riwayat</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="toko__brand">
          <img className="toko__brandLogo" src={currentLogo} alt="ReaStock" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="toko__bottom" ref={featuresRef}>
        <div className="toko__bottomHeader">Features/</div>

        <div className="toko__features">
          <Card className="toko__featureCard">
            <div className="toko__featureTitle">Request Barang</div>
            <div className="toko__featureText">
              Buat request ke gudang dan pantau statusnya secara cepat.
            </div>
          </Card>

          <Card className="toko__featureCard toko__featureCard--center">
            <div className="toko__featureTitle">Realtime</div>
            <div className="toko__featureText">
              Stok & status request diperbarui otomatis (simulasi realtime).
            </div>
          </Card>

          <Card className="toko__featureCard">
            <div className="toko__featureTitle">Alerts</div>
            <div className="toko__featureText">
              Notifikasi stok menipis supaya toko bisa request sebelum kosong.
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
