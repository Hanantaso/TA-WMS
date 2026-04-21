import { useMemo, useState } from "react";
import "./PageAdmin.css";
import "./ManajemenStokAdmin.css";

const LS_KEY_GUDANG_NOTIF = "reastock_notifications_gudang_v1";

export default function ManajemenStok() {
  const summary = useMemo(() => {
    const totalPerusahaan = 2104;
    const stokGudang = 1860;
    const stokToko = 244;

    return { totalPerusahaan, stokGudang, stokToko };
  }, []);

  const [requests, setRequests] = useState([
    {
      id: "ADD-001",
      tanggal: "2026-02-01 09:12",
      barang: "BRG-002 (Lampu LED)",
      jumlah: 50,
      catatan: "Tambah stok untuk promo akhir pekan",
      status: "Selesai",
    },
    {
      id: "ADD-002",
      tanggal: "2026-02-02 14:30",
      barang: "BRG-010 (Kabel 10m)",
      jumlah: 20,
      catatan: "Restock rutin",
      status: "Pending",
    },
    {
      id: "ADD-003",
      tanggal: "2026-02-03 10:05",
      barang: "BRG-017 (Kran Air)",
      jumlah: 15,
      catatan: "Permintaan owner",
      status: "Pending",
    },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [sentBanner, setSentBanner] = useState("");
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    kodeBarang: "",
    namaBarang: "",
    kategori: "Peralatan",
    jumlah: "",
    satuan: "pcs",
    supplier: "",
    prioritas: "Normal",
    catatan: "",
  });

  function resetForm() {
    setForm({
      kodeBarang: "",
      namaBarang: "",
      kategori: "Peralatan",
      jumlah: "",
      satuan: "pcs",
      supplier: "",
      prioritas: "Normal",
      catatan: "",
    });
  }

  function nowStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function nextId() {
    const n = requests.length + 1;
    return `ADD-${String(n).padStart(3, "0")}`;
  }

  function pushNotifToGudang(payload) {
    try {
      const raw = localStorage.getItem(LS_KEY_GUDANG_NOTIF);
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(payload);
      localStorage.setItem(LS_KEY_GUDANG_NOTIF, JSON.stringify(arr));
    } catch {
      // sengaja diamkan agar tidak merusak flow halaman
    }
  }

  function handleSend(e) {
    e.preventDefault();

    if (
      !form.kodeBarang.trim() ||
      !form.namaBarang.trim() ||
      !String(form.jumlah).trim()
    ) {
      setToast("Mohon lengkapi Kode Barang, Nama Barang, dan Jumlah.");
      window.setTimeout(() => setToast(""), 2200);
      return;
    }

    const newReq = {
      id: nextId(),
      tanggal: nowStamp(),
      barang: `${form.kodeBarang.trim()} (${form.namaBarang.trim()})`,
      jumlah: Number(form.jumlah),
      catatan: form.catatan?.trim() || "-",
      status: "Pending",
    };

    setRequests((prev) => [newReq, ...prev]);

    pushNotifToGudang({
      type: "ADD_STOK_GUDANG",
      title: "Perintah penambahan stok (Admin/Owner)",
      createdAt: newReq.tanggal,
      payload: {
        id: newReq.id,
        kodeBarang: form.kodeBarang.trim(),
        namaBarang: form.namaBarang.trim(),
        kategori: form.kategori,
        jumlah: Number(form.jumlah),
        satuan: form.satuan,
        supplier: form.supplier?.trim() || "-",
        prioritas: form.prioritas,
        catatan: form.catatan?.trim() || "-",
      },
      read: false,
    });

    setOpenForm(false);
    resetForm();

    setSentBanner("Penambahan stok telah terkirim.");
    window.setTimeout(() => setSentBanner(""), 2600);

    setToast("Request berhasil dikirim ke Gudang (dummy).");
    window.setTimeout(() => setToast(""), 2200);
  }

  const getStatusClass = (status) => {
    if (status === "Selesai") return "stokAdm__status stokAdm__status--done";
    if (status === "Pending") return "stokAdm__status stokAdm__status--pending";
    return "stokAdm__status";
  };

  return (
    <div className="pageAdmin stokAdm">
      <div className="stokAdm__hero">
        <div>
          <h1 className="stokAdm__title">Manajemen Stok</h1>
          <p className="stokAdm__subtitle">
            Monitoring stok perusahaan dan permintaan penambahan stok gudang.
          </p>
        </div>

        <div className="stokAdm__heroBadge">Admin / Owner</div>
      </div>

      {sentBanner && (
        <div className="stokAdm__banner">
          <span className="stokAdm__bannerDot" />
          {sentBanner}
        </div>
      )}

      <div className="stokAdm__topGrid">
        <section className="stokAdm__panel">
          <div className="stokAdm__panelHead">
            <div>
              <h2>Ringkasan Stok</h2>
              <p>Realtime (dummy)</p>
            </div>
          </div>

          <div className="stokAdm__cards">
            <article className="stokAdm__metric stokAdm__metric--brown">
              <div className="stokAdm__metricIcon">📦</div>
              <div className="stokAdm__metricLabel">Total Stok Perusahaan</div>
              <div className="stokAdm__metricValue">
                {summary.totalPerusahaan.toLocaleString("id-ID")}
              </div>
              <div className="stokAdm__metricSub">Gudang + Toko</div>
            </article>

            <article className="stokAdm__metric stokAdm__metric--orange">
              <div className="stokAdm__metricIcon">🏬</div>
              <div className="stokAdm__metricLabel">Stok Tersedia di Gudang</div>
              <div className="stokAdm__metricValue">
                {summary.stokGudang.toLocaleString("id-ID")}
              </div>
              <div className="stokAdm__metricSub">Siap distribusi</div>
            </article>

            <article className="stokAdm__metric stokAdm__metric--green">
              <div className="stokAdm__metricIcon">🏪</div>
              <div className="stokAdm__metricLabel">Stok Tersedia di Toko</div>
              <div className="stokAdm__metricValue">
                {summary.stokToko.toLocaleString("id-ID")}
              </div>
              <div className="stokAdm__metricSub">Siap jual</div>
            </article>
          </div>
        </section>

        <aside className="stokAdm__panel stokAdm__panel--action">
          <div className="stokAdm__panelHead">
            <div>
              <h2>Aksi</h2>
              <p>Kelola permintaan stok gudang</p>
            </div>
          </div>

          <div className="stokAdm__actionButtons">
            <button
              type="button"
              className="stokAdm__primaryBtn"
              onClick={() => {
                setSentBanner("");
                setOpenForm(true);
              }}
            >
              + Tambah Stok Gudang
            </button>

            <button
              type="button"
              className="stokAdm__ghostBtn"
              disabled
              title="Fitur belum tersedia"
            >
              Import (Coming Soon)
            </button>
          </div>

          <div className="stokAdm__note">
            Saat ini pengiriman request penambahan stok disimulasikan dan
            disimpan ke <b>localStorage</b> untuk notifikasi gudang.
          </div>
        </aside>
      </div>

      <section className="stokAdm__panel stokAdm__tablePanel">
        <div className="stokAdm__panelHead stokAdm__panelHead--table">
          <div>
            <h2>Riwayat Request Penambahan Stok ke Gudang</h2>
            <p>
              Status akan berubah setelah gudang melakukan konfirmasi (dummy).
            </p>
          </div>
          <div className="stokAdm__tableCount">Total: {requests.length}</div>
        </div>

        <div className="stokAdm__tableWrap">
          <table className="stokAdm__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tanggal</th>
                <th>Barang</th>
                <th>Jumlah</th>
                <th>Catatan</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="stokAdm__id">{r.id}</td>
                  <td>{r.tanggal}</td>
                  <td>{r.barang}</td>
                  <td className="stokAdm__qty">{r.jumlah}</td>
                  <td>{r.catatan}</td>
                  <td>
                    <span className={getStatusClass(r.status)}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {openForm && (
        <div
          className="stokAdm__overlay"
          onClick={(e) => {
            if (e.target.classList.contains("stokAdm__overlay")) {
              setOpenForm(false);
            }
          }}
        >
          <div className="stokAdm__modal">
            <div className="stokAdm__modalHead">
              <div>
                <h3>Form Penambahan Stok Gudang</h3>
                <p>Lengkapi data barang yang ingin ditambahkan ke gudang.</p>
              </div>

              <button
                type="button"
                className="stokAdm__closeBtn"
                onClick={() => setOpenForm(false)}
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSend} className="stokAdm__form">
              <div className="stokAdm__formGrid">
                <label className="stokAdm__field">
                  <span>Kode Barang</span>
                  <input
                    value={form.kodeBarang}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, kodeBarang: e.target.value }))
                    }
                    placeholder="contoh: BRG-021"
                  />
                </label>

                <label className="stokAdm__field">
                  <span>Nama Barang</span>
                  <input
                    value={form.namaBarang}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, namaBarang: e.target.value }))
                    }
                    placeholder="contoh: Pipa 1/2 inch"
                  />
                </label>

                <label className="stokAdm__field">
                  <span>Kategori</span>
                  <select
                    value={form.kategori}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, kategori: e.target.value }))
                    }
                  >
                    <option>Peralatan</option>
                    <option>Bahan Bangunan</option>
                    <option>Elektrikal</option>
                    <option>Plumbing</option>
                    <option>Lainnya</option>
                  </select>
                </label>

                <label className="stokAdm__field">
                  <span>Jumlah</span>
                  <input
                    type="number"
                    min="1"
                    value={form.jumlah}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, jumlah: e.target.value }))
                    }
                    placeholder="contoh: 50"
                  />
                </label>

                <label className="stokAdm__field">
                  <span>Satuan</span>
                  <select
                    value={form.satuan}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, satuan: e.target.value }))
                    }
                  >
                    <option>pcs</option>
                    <option>box</option>
                    <option>pack</option>
                    <option>kg</option>
                    <option>meter</option>
                  </select>
                </label>

                <label className="stokAdm__field">
                  <span>Supplier (opsional)</span>
                  <input
                    value={form.supplier}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, supplier: e.target.value }))
                    }
                    placeholder="contoh: PT Sumber Makmur"
                  />
                </label>

                <label className="stokAdm__field">
                  <span>Prioritas</span>
                  <select
                    value={form.prioritas}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, prioritas: e.target.value }))
                    }
                  >
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </label>

                <label className="stokAdm__field stokAdm__field--full">
                  <span>Catatan</span>
                  <textarea
                    rows="4"
                    value={form.catatan}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, catatan: e.target.value }))
                    }
                    placeholder="Catatan tambahan untuk gudang (opsional)"
                  />
                </label>
              </div>

              <div className="stokAdm__formHint">
                Setelah klik <b>Send</b>, request akan masuk ke tabel riwayat
                dan notifikasi gudang via <b>localStorage</b>.
              </div>

              <div className="stokAdm__formActions">
                <button
                  type="button"
                  className="stokAdm__ghostBtn"
                  onClick={resetForm}
                >
                  Clear
                </button>

                <button type="submit" className="stokAdm__primaryBtn">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="stokAdm__toast">{toast}</div>}
    </div>
  );
}