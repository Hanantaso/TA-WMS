import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

import Card from "../../components/common/Card";
import bgCardToko from "../../assets/images/bgCardToko.jpg";
import bgCardGudang from "../../assets/images/bgCardGudang.jpg";
import bg from "../../assets/images/BgDashboard.avif";
import stokImg from "../../assets/images/stok.jpg";

import logo from "../../assets/images/logo.png";
import logoLight from "../../assets/images/logoLight.png";

export default function AdminDashboard() {
  const { featuresRef } = useOutletContext();

  // ✅ theme state untuk swap logo
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "warm"
  );

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      setTheme(root.dataset.theme || "warm");
    };

    updateTheme();

    const obs = new MutationObserver(() => updateTheme());
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => obs.disconnect();
  }, []);

  const currentLogo = theme === "dark" ? logoLight : logo;

  return (
    <div className="admin">
      {/* =========================
          TOP 
          ========================= */}
      <section className="admin__hero" style={{ backgroundImage: `url(${bg})` }}>
        <div className="admin__heroInner admin__heroInner--center">
          <h1 className="admin__title admin__title--center">
            Selamat Datang,
            <br />
            Admin!
          </h1>

          <div className="admin__stats admin__stats--hero">
            <Card className="admin__statCard admin__statCard--dark">
              <div className="admin__statLabel admin__statLabel--big">
                Stok Gudang
              </div>
              <div className="admin__statValue admin__statValue--big">
                1,860 barang
              </div>
              <div className="admin__statStatus admin__statStatus--ok">
                Stok aman!
              </div>
            </Card>

            <Card className="admin__statCard--dark admin__statCard--center admin__statCard--drop">
              <div className="admin__statLabel admin__statLabel--big">
                Stok Perusahaan
              </div>
              <div className="admin__statValue admin__statValue--big">
                2,104 barang
              </div>
            </Card>

            <Card className="admin__statCard admin__statCard--dark">
              <div className="admin__statLabel admin__statLabel--big">
                Stok Toko
              </div>
              <div className="admin__statValue admin__statValue--big">
                224 barang
              </div>
              <div className="admin__statStatus admin__statStatus--warn">
                Stok Tipis!
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* =========================
          MIDDLE
          ========================= */}
      <section className="admin__middle admin__middle--design">
        <div className="admin__middleHeader">
          <div className="admin__middleHeaderLeft">Manajemen Gudang</div>

          <div className="admin__middleHeaderRight">
            <div className="admin__middleHeaderTitle">
              Pengelolaan stok gudang
              <br />
              dengan ReaStock dapat
              <br />
              mempercepat pekerjaan dengan
              <br />
              adanya Real-Time
            </div>
            <div className="admin__middleHeaderSub">Jelajahi ReaStock</div>
          </div>
        </div>

        <div className="admin__middleDivider1" />

        <div className="admin__middleCenterTitle">Manajemen Gudang</div>

        <div className="admin__middleDivider" />

        <div className="admin__middleCardsWrap">
          <Link
            to="/admin/stok-gudang"
            className="admin__navCard admin__navCard--big"
          >
            <img src={stokImg} alt="Manajemen Stok Gudang" />
            <div className="admin__imgCardOverlay">
              <div className="admin__imgCardText">Manajemen Stok Gudang</div>
            </div>
          </Link>

          <div className="admin__middleCardsRow">
            <Link to="/admin/gudang" className="admin__navCard">
              <img src={bgCardGudang} alt="Manajemen Gudang" />
              <div className="admin__imgCardOverlay">
                <div className="admin__imgCardText">Manajemen Gudang</div>
              </div>
            </Link>

            <Link to="/admin/toko" className="admin__navCard">
              <img src={bgCardToko} alt="Manajemen Toko" />
              <div className="admin__imgCardOverlay">
                <div className="admin__imgCardText">Manajemen Toko</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="admin__middleDivider admin__middleDivider--bottom" />

        {/* ✅ Logo berubah sesuai theme */}
        <div className="admin__middleBrand">
          <img className="admin__middleBrandLogo" src={currentLogo} alt="ReaStock" />
        </div>
      </section>

      {/* =========================
          BOTTOM
          ========================= */}
      <section className="admin__bottom" ref={featuresRef}>
        <div className="admin__bottomHeader">Features/</div>

        <div className="admin__brandCircle">
          <div className="admin__brandCircleInner">
            <img className="admin__BrandCircleLogo" src={currentLogo} />
          </div>
        </div>

        <div className="admin__features">
          <Card className="admin__featureCard">
            <div className="admin__featureTitle">Request&apos;s</div>
            <div className="admin__featureText">
              Melihat kebutuhan dengan cepat, tanpa harus menunggu update manual
              permintaan stok.
            </div>
          </Card>

          <Card className="admin__featureCard admin__featureCard--center">
            <div className="admin__featureTitle">Real-Time</div>
            <div className="admin__featureText">
              Memastikan seluruh pergerakan dan perubahan stok tercatat secara
              langsung.
            </div>
          </Card>

          <Card className="admin__featureCard">
            <div className="admin__featureTitle">Alerts</div>
            <div className="admin__featureText">
              Notifikasi otomatis ketika stok menipis atau ada informasi dari
              toko/gudang.
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
