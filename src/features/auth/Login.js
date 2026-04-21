import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import Button from "../../components/common/Button";
import logo from "../../assets/images/logo.png";

export default function Login() {
  const nav = useNavigate();
  const easing = useMemo(() => [0.22, 1, 0.36, 1], []);

  // fade-out (tetap, jangan diubah)
  const [isLeaving, setIsLeaving] = useState(false);

  // ✅ controlled inputs
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("");

  // ✅ error message (biar UX bagus)
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const eLower = email.trim().toLowerCase();
    const p = password.trim();

    // ✅ mapping kredensial -> role + tujuan
    const users = {
      "admin@gmail.com": { pass: "admin", role: "admin", path: "/admin" },
      "gudang@gmail.com": { pass: "gudang", role: "gudang", path: "/gudang" },
      "toko@gmail.com": { pass: "toko", role: "toko", path: "/toko" },
    };

    const user = users[eLower];

    if (!user || user.pass !== p) {
      setError("Email atau password salah.");
      return;
    }

    // ✅ simpan role untuk kebutuhan app (guard nanti / topbar, dll)
    localStorage.setItem("reastock_role", user.role);

    // trigger fade-out
    setIsLeaving(true);

    // pindah setelah animasi selesai (durasi kamu 0.42s)
    setTimeout(() => {
      nav(user.path);
    }, 420);
  };

  return (
    <motion.div
      className="loginScene figmaLogin"
      initial={{ opacity: 1, filter: "blur(0px)" }}
      animate={{
        opacity: isLeaving ? 0 : 1,
        filter: isLeaving ? "blur(6px)" : "blur(0px)",
      }}
      transition={{ duration: 0.42, ease: easing }}
    >
      {/* LEFT: form area */}
      <motion.div
        className="loginScene__formWrap figmaLogin__left"
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.45, duration: 0.5, ease: easing }}
      >
        <div className="figmaLogin__title">Welcome to ReaStock!</div>
        <div className="figmaLogin__subtitle">
          Enter your Credentials to access your account
        </div>

        <form className="figmaForm" onSubmit={handleSubmit}>
          <div className="figmaField">
            <label className="figmaLabel">Email address</label>
            <input
              className="figmaInput"
              type="email"
              placeholder="admin@gmail.com / gudang@gmail.com / toko@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="figmaField">
            <div className="figmaRow">
              <label className="figmaLabel">Password</label>
              <button type="button" className="figmaForgot">
                forgot password
              </button>
            </div>
            <input
              className="figmaInput"
              type="password"
              placeholder="admin / gudang / toko"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <label className="figmaCheck">
            <input type="checkbox" />
            Remember for 30 days
          </label>

          {/* ✅ error message */}
          {error ? <div className="figmaError">{error}</div> : null}

          <div className="figmaBtnWrap">
            <Button className="figmaBtn" type="submit">
              Login
            </Button>
          </div>
        </form>
      </motion.div>

      {/* RIGHT: moving panel (tetap sama) */}
      <motion.div
        className="loginScene__panel figmaLogin__panel"
        initial={{ x: 0 }}
        animate={{ x: "40vw" }}
        transition={{ duration: 2.0, ease: easing }}
      >
        <motion.div
          className="loginScene__panelInner figmaLogin__panelInner"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: easing, delay: 0.08 }}
        >
          <img className="figmaLogin__logo" src={logo} alt="ReaStock" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
