import { Outlet, useLocation } from "react-router-dom";
import { useMemo, useRef } from "react";
import Topbar from "../../components/layout/Topbar";
import "./GudangLayout.css";

export default function GudangLayout() {
  const featuresRef = useRef(null);
  const location = useLocation();

  const isHome = useMemo(() => {
    return location.pathname === "/gudang" || location.pathname === "/gudang/";
  }, [location.pathname]);

  return (
    <div className="gudangLayout">
      <Topbar
        basePath="/gudang"
        avatarLetter="G"
        onScrollToFeatures={
          isHome ? () => featuresRef.current?.scrollIntoView({ behavior: "smooth" }) : undefined
        }
      />

      <Outlet context={{ featuresRef }} />
    </div>
  );
}
