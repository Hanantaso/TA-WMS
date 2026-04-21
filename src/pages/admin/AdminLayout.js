import { Outlet, useLocation } from "react-router-dom";
import { useMemo, useRef } from "react";
import Topbar from "../../components/layout/Topbar";
import "./AdminLayout.css";

export default function AdminLayout() {
  const featuresRef = useRef(null);
  const location = useLocation();

  const isAdminHome = useMemo(() => {
    // "/admin" atau "/admin/"
    return location.pathname === "/admin" || location.pathname === "/admin/";
  }, [location.pathname]);

  return (
    <div className="adminLayout">
      <Topbar
        // ✅ kalau bukan di dashboard utama, tombol Features tetap ada tapi fallback navigate
        onScrollToFeatures={
          isAdminHome ? () => featuresRef.current?.scrollIntoView({ behavior: "smooth" }) : undefined
        }
      />

      {/* Content halaman */}
      <Outlet context={{ featuresRef }} />
    </div>
  );
}
