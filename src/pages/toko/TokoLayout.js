import { Outlet, useLocation } from "react-router-dom";
import { useMemo, useRef } from "react";
import Topbar from "../../components/layout/Topbar";
import "./TokoLayout.css";

export default function TokoLayout() {
  const featuresRef = useRef(null);
  const location = useLocation();

  const isHome = useMemo(() => {
    return location.pathname === "/toko" || location.pathname === "/toko/";
  }, [location.pathname]);

  return (
    <div className="tokoLayout">
      <Topbar
        basePath="/toko"
        avatarLetter="T"
        onScrollToFeatures={
          isHome ? () => featuresRef.current?.scrollIntoView({ behavior: "smooth" }) : undefined
        }
      />

      <Outlet context={{ featuresRef }} />
    </div>
  );
}
