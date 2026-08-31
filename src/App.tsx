import { useState, useRef, useEffect, type CSSProperties, type ReactNode } from "react"

type Estado = "cargando" | "ruta" | "descargando" | "vacio"

interface Unidad {
  id: string
  placa: string
  operador: string
  origen: string
  destino: string
  carga: string
  toneladas: number
  hora: string
}

interface Columna {
  id: Estado
  label: string
  icon: ReactNode
  accent: string
  accentDim: string
  accentGlow: string
}

const COLUMNAS: Columna[] = [
  {
    id: "cargando",
    label: "Cargando",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect
          x="1"
          y="8"
          width="13"
          height="5"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M4 8V5.5C4 4.12 5.12 3 6.5 3h2C9.88 3 11 4.12 11 5.5V8"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M6 6h3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    accent: "#f59f00",
    accentDim: "rgba(245,159,0,0.1)",
    accentGlow: "rgba(245,159,0,0.35)",
  },
  {
    id: "ruta",
    label: "En Ruta",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M1.5 10.5h9a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5.5L2.5 7v3.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle
          cx="4.5"
          cy="11.5"
          r="1.2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <circle
          cx="11"
          cy="11.5"
          r="1.2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M13.5 10.5h.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    accent: "#4c6ef5",
    accentDim: "rgba(76,110,245,0.1)",
    accentGlow: "rgba(76,110,245,0.35)",
  },
  {
    id: "descargando",
    label: "Descargando",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect
          x="1"
          y="8"
          width="13"
          height="5"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M7.5 1v6M5 5l2.5 2.5L10 5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    accent: "#cc5de8",
    accentDim: "rgba(204,93,232,0.1)",
    accentGlow: "rgba(204,93,232,0.35)",
  },
  {
    id: "vacio",
    label: "Vacío",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M1.5 10.5h9a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5.5L2.5 7v3.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeDasharray="2 1.5"
        />
        <circle
          cx="4.5"
          cy="11.5"
          r="1.2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <circle
          cx="11"
          cy="11.5"
          r="1.2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    ),
    accent: "#40c057",
    accentDim: "rgba(64,192,87,0.1)",
    accentGlow: "rgba(64,192,87,0.35)",
  },
]

const UNIDADES_INICIAL: Record<Estado, Unidad[]> = {
  cargando: [
    {
      id: "u1",
      placa: "MXY-2341",
      operador: "Carlos Ruiz",
      origen: "CDMX - Vallejo",
      destino: "Monterrey",
      carga: "Electrodomésticos",
      toneladas: 18.5,
      hora: "07:30",
    },
    {
      id: "u2",
      placa: "TKL-8812",
      operador: "Jesús Mora",
      origen: "Guadalajara",
      destino: "Tijuana",
      carga: "Autopartes",
      toneladas: 22.0,
      hora: "08:15",
    },
    {
      id: "u3",
      placa: "FRP-5560",
      operador: "Ana Torres",
      origen: "Puebla",
      destino: "Veracruz",
      carga: "Alimentos secos",
      toneladas: 14.2,
      hora: "09:00",
    },
  ],
  ruta: [
    {
      id: "u4",
      placa: "LZT-4490",
      operador: "Miguel Soto",
      origen: "CDMX",
      destino: "León, Gto.",
      carga: "Textiles",
      toneladas: 19.8,
      hora: "05:10",
    },
    {
      id: "u5",
      placa: "BRN-7723",
      operador: "Sandra López",
      origen: "Monterrey",
      destino: "Saltillo",
      carga: "Materiales de construcción",
      toneladas: 24.0,
      hora: "06:45",
    },
    {
      id: "u6",
      placa: "GTZ-1198",
      operador: "Roberto Vega",
      origen: "Querétaro",
      destino: "San Luis Potosí",
      carga: "Farmacéuticos",
      toneladas: 9.5,
      hora: "04:30",
    },
    {
      id: "u7",
      placa: "NVR-3345",
      operador: "Luis Hernández",
      origen: "Mérida",
      destino: "Cancún",
      carga: "Bebidas",
      toneladas: 21.3,
      hora: "03:00",
    },
  ],
  descargando: [
    {
      id: "u8",
      placa: "CXM-6671",
      operador: "Pedro Jiménez",
      origen: "Veracruz",
      destino: "CDMX - Iztapalapa",
      carga: "Electrónica",
      toneladas: 16.0,
      hora: "10:20",
    },
    {
      id: "u9",
      placa: "WRP-9934",
      operador: "Elena Castillo",
      origen: "Tijuana",
      destino: "Ensenada",
      carga: "Importaciones",
      toneladas: 11.5,
      hora: "10:55",
    },
  ],
  vacio: [
    {
      id: "u10",
      placa: "QST-2287",
      operador: "Marco Díaz",
      origen: "—",
      destino: "—",
      carga: "—",
      toneladas: 0,
      hora: "11:30",
    },
    {
      id: "u11",
      placa: "HVL-4456",
      operador: "Patricia Nava",
      origen: "—",
      destino: "—",
      carga: "—",
      toneladas: 0,
      hora: "11:45",
    },
  ],
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M1 12V6.5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 2 2V12"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 8.5H15l1.5 2V12h-4V8.5Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="13.5" r="1.5" stroke="white" strokeWidth="1.5" />
      <circle cx="10" cy="13.5" r="1.5" stroke="white" strokeWidth="1.5" />
      <circle cx="14.5" cy="13.5" r="1.5" stroke="white" strokeWidth="1.5" />
    </svg>
  )
}

function UnidadCard({
  unidad,
  columna,
  isDragging,
  onDragStart,
  onMover,
  onEditar,
  onEliminar,
  estados,
}: {
  unidad: Unidad
  columna: Columna
  isDragging: boolean
  onDragStart: () => void
  onMover: (id: string, destino: Estado) => void
  onEditar: (unidad: Unidad) => void
  onEliminar: (id: string) => void
  estados: Columna[]
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        background: isDragging ? "rgba(30,37,53,0.3)" : "#1a2133",
        border: `1px solid ${isDragging ? columna.accent + "55" : "#222d44"}`,
        borderRadius: 11,
        padding: "13px 14px",
        cursor: "grab",
        opacity: isDragging ? 0.35 : 1,
        userSelect: "none",
        transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
        position: "relative",
      }}
      className="group hover:border-[#3a4a66] hover:shadow-[0_6px_28px_rgba(0,0,0,0.4)] hover:-translate-y-[2px]"
    >
      {/* Placa */}
      <div className="flex items-center justify-between mb-3">
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #2a3855",
            borderRadius: 7,
            padding: "4px 10px",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: columna.accent,
              boxShadow: `0 0 7px ${columna.accentGlow}`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              fontWeight: 500,
              color: "#e8eaf2",
              letterSpacing: "0.12em",
            }}
          >
            {unidad.placa}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Editar */}
          <button
            onClick={() => { setConfirmDelete(false); onEditar(unidad) }}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #2a3855",
              borderRadius: 6,
              padding: "5px 7px",
              cursor: "pointer",
              color: "#6b7fa8",
              display: "flex",
              alignItems: "center",
              transition: "background 0.15s, color 0.15s",
            }}
            className="hover:bg-[#2a3855] hover:text-[#aab4cc]"
            title="Editar unidad"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M7.5 1.5l2 2-5.5 5.5H2v-2L7.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Eliminar con confirmación inline */}
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEliminar(unidad.id)}
                style={{
                  background: "rgba(220,38,38,0.15)",
                  border: "1px solid rgba(220,38,38,0.5)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  cursor: "pointer",
                  color: "#f87171",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 2.5h7M3.5 2.5V1.5h3v1M4.5 4.5v3M5.5 4.5v3M2 2.5l.5 6h5l.5-6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Confirmar
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid #2a3855",
                  borderRadius: 6,
                  padding: "4px 7px",
                  cursor: "pointer",
                  color: "#6b7fa8",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid #2a3855",
                borderRadius: 6,
                padding: "5px 7px",
                cursor: "pointer",
                color: "#6b7fa8",
                display: "flex",
                alignItems: "center",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
              }}
              className="hover:bg-[#3d1a1a] hover:border-[#7f2020] hover:text-[#f87171]"
              title="Eliminar unidad"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1.5 2.5h8M3.5 2.5V1.5h4v1M2 2.5l.6 7h5.8l.6-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Menú de movimiento */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #2a3855",
              borderRadius: 6,
              padding: "5px 8px",
              cursor: "pointer",
              color: "#6b7fa8",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              transition: "background 0.15s, color 0.15s",
            }}
            className="hover:bg-[#2a3855] hover:text-[#aab4cc]"
            title="Mover unidad"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m17 2 4 4-4 4" />
              <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
              <path d="m7 22-4-4 4-4" />
              <path d="M21 13v1a4 4 0 0 1-4 4H3" />
            </svg>
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 6px)",
                background: "#1e2840",
                border: "1px solid #2a3855",
                borderRadius: 9,
                padding: 5,
                zIndex: 30,
                minWidth: 150,
                boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
              }}
            >
              {estados
                .filter((e) => e.id !== columna.id)
                .map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      onMover(unidad.id, e.id)
                      setMenuOpen(false)
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: "transparent",
                      border: "none",
                      color: "#c4cddf",
                      fontSize: 12,
                      fontFamily: "var(--font-sans)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.1s",
                    }}
                    className="hover:bg-[#273348]"
                  >
                    <span style={{ color: e.accent }}>{e.icon}</span>
                    {e.label}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Operador */}
      <div className="flex items-center gap-2 mb-3">
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${columna.accent}88, ${columna.accent}44)`,
            border: `1px solid ${columna.accent}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 700,
            color: columna.accent,
            fontFamily: "var(--font-mono)",
            flexShrink: 0,
          }}
        >
          {unidad.operador
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <span style={{ fontSize: 12.5, color: "#8896b3", fontWeight: 500 }}>
          {unidad.operador}
        </span>
      </div>

      {/* Ruta */}
      {unidad.origen !== "—" && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #1e2a3e",
            borderRadius: 7,
            padding: "8px 10px",
            marginBottom: 10,
          }}
        >
          <div className="flex items-center gap-2">
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 10,
                  color: "#4a5878",
                  fontFamily: "var(--font-mono)",
                  marginBottom: 2,
                }}
              >
                ORIGEN
              </div>
              <div style={{ fontSize: 12, color: "#9aa5be", fontWeight: 500 }}>
                {unidad.origen}
              </div>
            </div>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path
                d="M1 5h14M10 1l4 4-4 4"
                stroke="#2a3855"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div style={{ flex: 1, textAlign: "right" }}>
              <div
                style={{
                  fontSize: 10,
                  color: "#4a5878",
                  fontFamily: "var(--font-mono)",
                  marginBottom: 2,
                }}
              >
                DESTINO
              </div>
              <div style={{ fontSize: 12, color: "#9aa5be", fontWeight: 500 }}>
                {unidad.destino}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {unidad.carga !== "—" ? (
          <div className="flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect
                x="1"
                y="4"
                width="9"
                height="6"
                rx="1"
                stroke="#4a5878"
                strokeWidth="1.1"
              />
              <path
                d="M3.5 4V3a2 2 0 0 1 4 0v1"
                stroke="#4a5878"
                strokeWidth="1.1"
              />
            </svg>
            <span
              style={{
                fontSize: 11,
                color: "#5a6a88",
                fontFamily: "var(--font-mono)",
              }}
            >
              {unidad.carga}
            </span>
          </div>
        ) : (
          <span
            style={{
              fontSize: 11,
              color: "#3a4860",
              fontFamily: "var(--font-mono)",
            }}
          >
            Sin carga
          </span>
        )}

        <div className="flex items-center gap-3">
          {unidad.toneladas > 0 && (
            <span
              style={{
                fontSize: 11,
                color: columna.accent,
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
              }}
            >
              {unidad.toneladas}t
            </span>
          )}
          <span
            style={{
              fontSize: 11,
              color: "#3a4860",
              fontFamily: "var(--font-mono)",
            }}
          >
            {unidad.hora}
          </span>
        </div>
      </div>
    </div>
  )
}

function UnidadModal({
  unidadInicial,
  estadoInicial,
  onClose,
  onGuardar,
}: {
  unidadInicial?: Unidad
  estadoInicial?: Estado
  onClose: () => void
  onGuardar: (estado: Estado, unidad: Unidad) => void
}) {
  const esEdicion = !!unidadInicial
  const [placa, setPlaca] = useState(unidadInicial?.placa ?? "")
  const [operador, setOperador] = useState(unidadInicial?.operador ?? "")
  const [origen, setOrigen] = useState(
    unidadInicial?.origen === "—" ? "" : (unidadInicial?.origen ?? ""),
  )
  const [destino, setDestino] = useState(
    unidadInicial?.destino === "—" ? "" : (unidadInicial?.destino ?? ""),
  )
  const [carga, setCarga] = useState(
    unidadInicial?.carga === "—" ? "" : (unidadInicial?.carga ?? ""),
  )
  const [toneladas, setToneladas] = useState(
    unidadInicial?.toneladas ? String(unidadInicial.toneladas) : "",
  )
  const [estado, setEstado] = useState<Estado>(estadoInicial ?? "cargando")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit() {
    if (!placa.trim() || !operador.trim()) return
    const now = new Date()
    const hora = esEdicion
      ? (unidadInicial?.hora ??
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`)
      : `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    onGuardar(estado, {
      id: unidadInicial?.id ?? `u${Date.now()}`,
      placa: placa.trim().toUpperCase(),
      operador: operador.trim(),
      origen: origen.trim() || "—",
      destino: destino.trim() || "—",
      carga: carga.trim() || "—",
      toneladas: parseFloat(toneladas) || 0,
      hora,
    })
    onClose()
  }

  const field: CSSProperties = {
    background: "#0e1420",
    border: "1px solid #1e2a3e",
    borderRadius: 7,
    padding: "9px 12px",
    color: "#dde3f0",
    fontSize: 13,
    width: "100%",
    fontFamily: "var(--font-sans)",
    outline: "none",
  }

  const lbl: CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.07em",
    color: "#4a5878",
    marginBottom: 5,
    display: "block",
    fontFamily: "var(--font-mono)",
  }

  const colAccent = COLUMNAS.find((c) => c.id === estado)!
  const canSave = placa.trim() && operador.trim()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(5,8,16,0.82)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#111827",
          border: "1px solid #1e2a3e",
          borderRadius: 15,
          padding: "26px",
          width: 460,
          maxWidth: "95vw",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: colAccent.accentDim,
                border: `1px solid ${colAccent.accent}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colAccent.accent,
                transition: "all 0.2s",
              }}
            >
              {colAccent.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#e8eaf2",
                  letterSpacing: "-0.02em",
                }}
              >
                {esEdicion ? `Editar ${unidadInicial!.placa}` : "Nueva Unidad"}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#3a5088",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {esEdicion ? "EDITAR INFORMACIÓN" : "REGISTRO DE FLOTA"}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#3a5088",
              cursor: "pointer",
              padding: 4,
            }}
            className="hover:text-[#8896b3]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Placa + Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={lbl}>Placa *</label>
              <input
                ref={inputRef}
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                style={{
                  ...field,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
                placeholder="ABC-1234"
                maxLength={10}
              />
            </div>
            <div>
              <label style={lbl}>
                {esEdicion ? "Estado" : "Estado inicial"}
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as Estado)}
                style={field}
              >
                {COLUMNAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Operador */}
          <div>
            <label style={lbl}>Operador *</label>
            <input
              value={operador}
              onChange={(e) => setOperador(e.target.value)}
              style={field}
              placeholder="Nombre completo del operador"
            />
          </div>

          {/* Origen / Destino */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={lbl}>Origen</label>
              <input
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
                style={field}
                placeholder="Ciudad de origen"
              />
            </div>
            <div>
              <label style={lbl}>Destino</label>
              <input
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                style={field}
                placeholder="Ciudad destino"
              />
            </div>
          </div>

          {/* Carga / Toneladas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={lbl}>Tipo de carga</label>
              <input
                value={carga}
                onChange={(e) => setCarga(e.target.value)}
                style={field}
                placeholder="Ej. Electrodomésticos"
              />
            </div>
            <div>
              <label style={lbl}>Toneladas</label>
              <input
                value={toneladas}
                onChange={(e) => setToneladas(e.target.value)}
                style={field}
                placeholder="0.0"
                type="number"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onClose}
            style={{
              padding: "9px 18px",
              borderRadius: 7,
              background: "transparent",
              border: "1px solid #1e2a3e",
              color: "#4a5878",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
            className="hover:border-[#2a3855] hover:text-[#6b7a99]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSave}
            style={{
              padding: "9px 22px",
              borderRadius: 7,
              background: canSave ? colAccent.accent : "#1e2a3e",
              border: "none",
              color: canSave ? "#fff" : "#3a5088",
              fontSize: 13,
              fontWeight: 700,
              cursor: canSave ? "pointer" : "not-allowed",
              fontFamily: "var(--font-sans)",
              transition: "background 0.2s",
              letterSpacing: "0.01em",
            }}
          >
            {esEdicion ? "Guardar cambios" : "Registrar unidad"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [unidades, setUnidades] =
    useState<Record<Estado, Unidad[]>>(UNIDADES_INICIAL)
  const [dragging, setDragging] = useState<{ id: string; desde: Estado } | null>(
    null,
  )
  const [dragOver, setDragOver] = useState<Estado | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<{
    unidad: Unidad
    estado: Estado
  } | null>(null)

  const total = Object.values(unidades).reduce((s, arr) => s + arr.length, 0)

  function agregar(estado: Estado, unidad: Unidad) {
    setUnidades((prev) => ({ ...prev, [estado]: [...prev[estado], unidad] }))
  }

  function guardarEdicion(nuevoEstado: Estado, unidadActualizada: Unidad) {
    setUnidades((prev) => {
      const next = { ...prev }
      // Remove from all columns first
      for (const e of Object.keys(next) as Estado[]) {
        next[e] = next[e].filter((u) => u.id !== unidadActualizada.id)
      }
      // Add to target column
      next[nuevoEstado] = [...next[nuevoEstado], unidadActualizada]
      return next
    })
  }

  function abrirEdicion(unidad: Unidad) {
    const estado =
      (Object.keys(unidades) as Estado[]).find((e) =>
        unidades[e].some((u) => u.id === unidad.id),
      ) ?? "cargando"
    setEditando({ unidad, estado })
  }

  function eliminar(id: string) {
    setUnidades((prev) => {
      const next = { ...prev }
      for (const e of Object.keys(next) as Estado[]) {
        next[e] = next[e].filter((u) => u.id !== id)
      }
      return next
    })
  }

  function mover(id: string, destino: Estado) {
    setUnidades((prev) => {
      const next = { ...prev }
      let unidad: Unidad | undefined
      let desde: Estado | undefined

      for (const estado of Object.keys(next) as Estado[]) {
        const idx = next[estado].findIndex((u) => u.id === id)
        if (idx !== -1) {
          ;[unidad] = next[estado].splice(idx, 1)
          desde = estado
          next[estado] = [...next[estado]]
          break
        }
      }

      if (unidad && desde !== destino) {
        next[destino] = [...next[destino], unidad]
      } else if (unidad) {
        next[desde!] = [...next[desde!], unidad]
      }

      return { ...next }
    })
  }

  function handleDrop(destino: Estado) {
    if (!dragging) return
    if (dragging.desde !== destino) mover(dragging.id, destino)
    setDragging(null)
    setDragOver(null)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#090d16",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "rgba(13,18,30,0.95)",
          borderBottom: "1px solid #161f33",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 20,
          padding: "0 28px",
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg, #1d3a6e 0%, #0e1e40 100%)",
              border: "1px solid #2a3f6a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TruckIcon />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#e8eaf2",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              FlotaControl
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#3a5088",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.06em",
              }}
            >
              CONTROL DE UNIDADES
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-1">
          {COLUMNAS.map((col) => {
            const count = unidades[col.id].length
            return (
              <div
                key={col.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 13px",
                  borderRadius: 8,
                  background: count > 0 ? col.accentDim : "transparent",
                  border: `1px solid ${
                    count > 0 ? col.accent + "33" : "transparent"
                  }`,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ color: col.accent }}>{col.icon}</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: col.accent,
                    fontWeight: 500,
                  }}
                >
                  {count}
                </span>
                <span style={{ fontSize: 11, color: "#4a5878" }}>
                  {col.label}
                </span>
              </div>
            )
          })}
          <div
            style={{
              marginLeft: 8,
              padding: "6px 13px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #1e2a3e",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#8896b3",
              }}
            >
              {total} unidades totales
            </span>
          </div>

          <button
            onClick={() => setModalAbierto(true)}
            style={{
              marginLeft: 8,
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 16px",
              borderRadius: 8,
              background: "#1e3a6e",
              border: "1px solid #2a4f96",
              color: "#7eb3ff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              transition: "background 0.15s, border-color 0.15s",
            }}
            className="hover:bg-[#254a8a] hover:border-[#3a63b8]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1v10M1 6h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Nueva unidad
          </button>
        </div>
      </header>

      {modalAbierto && (
        <UnidadModal
          onClose={() => setModalAbierto(false)}
          onGuardar={agregar}
        />
      )}
      {editando && (
        <UnidadModal
          unidadInicial={editando.unidad}
          estadoInicial={editando.estado}
          onClose={() => setEditando(null)}
          onGuardar={guardarEdicion}
        />
      )}

      {/* Board */}
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          padding: "22px 24px",
          minHeight: "calc(100vh - 58px)",
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
      >
        {COLUMNAS.map((col) => {
          const isOver = dragOver === col.id
          const lista = unidades[col.id]

          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(col.id)
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(col.id)}
              style={{
                minWidth: 0,
                background: isOver ? col.accentDim : "rgba(13,18,30,0.7)",
                border: `1px solid ${isOver ? col.accent + "55" : "#161f33"}`,
                borderRadius: 13,
                padding: "14px",
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              {/* Column header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                  paddingBottom: 12,
                  borderBottom: `1px solid ${col.accent}22`,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: col.accentDim,
                      border: `1px solid ${col.accent}33`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: col.accent,
                    }}
                  >
                    {col.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#c4cddf",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {col.label}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#3a5088",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {lista.length} unidad{lista.length !== 1 ? "es" : ""}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: col.accentDim,
                    border: `1px solid ${col.accent}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    fontWeight: 700,
                    color: col.accent,
                  }}
                >
                  {lista.length}
                </div>
              </div>

              {/* Drop zone hint */}
              {isOver && (
                <div
                  style={{
                    border: `2px dashed ${col.accent}66`,
                    borderRadius: 9,
                    padding: "14px",
                    textAlign: "center",
                    marginBottom: 10,
                    color: col.accent,
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    background: col.accentDim,
                  }}
                >
                  Soltar aquí
                </div>
              )}

              {/* Cards */}
              <div className="flex flex-col gap-2.5">
                {lista.length === 0 && !isOver && (
                  <div
                    style={{
                      padding: "28px 16px",
                      textAlign: "center",
                      color: "#2a3855",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      border: "1px dashed #1a2538",
                      borderRadius: 9,
                    }}
                  >
                    Sin unidades
                  </div>
                )}
                {lista.map((u) => (
                  <UnidadCard
                    key={u.id}
                    unidad={u}
                    columna={col}
                    isDragging={dragging?.id === u.id}
                    onDragStart={() => setDragging({ id: u.id, desde: col.id })}
                    onMover={mover}
                    onEditar={abrirEdicion}
                    onEliminar={eliminar}
                    estados={COLUMNAS}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
