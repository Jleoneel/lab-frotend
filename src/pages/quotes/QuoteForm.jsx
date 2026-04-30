// components/quotes/QuoteForm.jsx
import { useState, Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import DatePicker from "../../components/ui/DatePicker";
import {
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  DollarSign,
  ChevronsUpDown,
  Check,
  Percent,
  Building2,
  Package,
  FileText,
  Hash,
  Tag,
  Scale,
} from "lucide-react";

// Componente Select personalizado con búsqueda
const Select = ({
  label,
  value,
  onChange,
  options = [],
  disabled,
  placeholder = "Seleccionar...",
  icon: Icon,
}) => {
  const selected = options.find((opt) => opt.value === value) || null;

  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "#666666", fontFamily: "'Montserrat', sans-serif" }}
        >
          {label}
        </label>
      )}
      <Listbox
        value={selected}
        onChange={(opt) => onChange(opt?.value || "")}
        disabled={disabled}
      >
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
              <Icon className="w-4 h-4" style={{ color: "#666666" }} />
            </div>
          )}
          <Listbox.Button
            className={`relative w-full cursor-default rounded-xl border bg-white py-2 text-left focus:outline-none focus:ring-2 focus:border-transparent shadow-sm ${
              Icon ? "pl-9 pr-10" : "pl-4 pr-10"
            }`}
            style={{ borderColor: "#E5E5E5" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#009933")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
          >
            <span className="block truncate" style={{ color: "#333333" }}>
              {selected ? (
                selected.label
              ) : (
                <span style={{ color: "#999999" }}>{placeholder}</span>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronsUpDown
                className="h-5 w-5"
                style={{ color: "#666666" }}
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((opt) => (
                <Listbox.Option
                  key={opt.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-[#009933] text-white" : "text-gray-900"
                    }`
                  }
                  value={opt}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                      >
                        {opt.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

// Input de cantidad con botones +/-
const QuantityInput = ({ value, onChange, min = 1, disabled }) => {
  const handleIncrement = () => onChange(value + 1);
  const handleDecrement = () => onChange(Math.max(min, value - 1));

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="px-3 py-2 border rounded-l-xl bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: "#E5E5E5", color: "#666666" }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.backgroundColor = "#F5F5F5";
        }}
        onMouseLeave={(e) => {
          if (!disabled) e.currentTarget.style.backgroundColor = "#F9F9F9";
        }}
      >
        −
      </button>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || min)}
        disabled={disabled}
        className="w-16 text-center border-t border-b py-2 focus:outline-none focus:ring-2 focus:ring-offset-0"
        style={{ borderColor: "#E5E5E5", color: "#333333" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#009933")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled}
        className="px-3 py-2 border rounded-r-xl bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: "#E5E5E5", color: "#666666" }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.backgroundColor = "#F5F5F5";
        }}
        onMouseLeave={(e) => {
          if (!disabled) e.currentTarget.style.backgroundColor = "#F9F9F9";
        }}
      >
        +
      </button>
    </div>
  );
};

// Componente Button
const Button = ({
  children,
  variant = "primary",
  className = "",
  disabled,
  onClick,
  type = "button",
}) => {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "text-white shadow-sm hover:shadow",
    secondary: "border transition-colors",
    ghost: "bg-transparent transition-colors",
  };

  const variantStyles = {
    primary: { backgroundColor: "#009933" },
    secondary: { borderColor: "#E5E5E5", color: "#666666" },
    ghost: { color: "#666666" },
  };

  const hoverStyles = {
    primary: { backgroundColor: "#00802b" },
    secondary: {
      backgroundColor: "#F5F5F5",
      borderColor: "#009933",
      color: "#009933",
    },
    ghost: { backgroundColor: "#F5F5F5", color: "#009933" },
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      style={variantStyles[variant]}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, hoverStyles[variant]);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, variantStyles[variant]);
        }
      }}
    >
      {children}
    </button>
  );
};

// Componente Input con iconos mejorado
const Input = ({
  label,
  type = "text",
  className = "",
  error,
  icon: Icon,
  ...props
}) => (
  <div className="w-full">
    {label && (
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: "#666666", fontFamily: "'Montserrat', sans-serif" }}
      >
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="w-4 h-4" style={{ color: "#666666" }} />
        </div>
      )}
      <input
        type={type}
        className={`w-full ${Icon ? "pl-9" : "pl-4"} pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-shadow ${
          error ? "border-red-300" : ""
        } ${className}`}
        style={{ borderColor: error ? "#FECACA" : "#E5E5E5", color: "#333333" }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#009933";
          e.currentTarget.style.boxShadow = "0 0 0 2px #00993320";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? "#FECACA" : "#E5E5E5";
          e.currentTarget.style.boxShadow = "none";
        }}
        {...props}
      />
    </div>
    {error && (
      <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
        {error}
      </p>
    )}
  </div>
);

// Componente principal
export default function QuoteForm({
  clients,
  services,
  initialData = {},
  onSubmit,
  onCancel,
}) {
  const safeClients = Array.isArray(clients) ? clients : [];
  const safeServices = Array.isArray(services) ? services : [];

  const [formData, setFormData] = useState({
    clientId: initialData.clientId || "",
    priceList: initialData.priceList || "EXTERNO",
    ivaPercent: 19,
    validUntil: "",
    items: initialData.items || [],
  });

  const [selectedService, setSelectedService] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Agrega este useEffect para cargar el IVA al montar
  useEffect(() => {
    const loadIva = async () => {
      try {
        const { settingsService } =
          await import("../../services/settingsService");
        const data = await settingsService.getIva();
        setFormData((prev) => ({ ...prev, ivaPercent: data.iva }));
      } catch (e) {
        // Error cargando IVA
      }
    };
    loadIva();
  }, []);

  const clientOptions = safeClients.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  const serviceOptions = safeServices.map((s) => ({
    value: s.id,
    label: `${s.code} – ${s.name} ($${s.priceExternal})`,
  }));
  const priceListOptions = [
    { value: "EXTERNO", label: "Externo" },
    { value: "ESTUDIANTE", label: "Estudiante" },
  ];

  const addItem = () => {
    const service = services.find((s) => s.id === selectedService);
    if (!service) return;

    const existingIndex = formData.items.findIndex(
      (i) => i.serviceId === service.id,
    );

    if (existingIndex >= 0) {
      const newItems = [...formData.items];
      newItems[existingIndex].quantity += quantity;
      setFormData({ ...formData, items: newItems });
    } else {
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          {
            serviceId: service.id,
            serviceName: service.name,
            serviceCode: service.code,
            quantity,
          },
        ],
      });
    }

    setSelectedService("");
    setQuantity(1);
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validUntilISO = formData.validUntil
      ? new Date(formData.validUntil).toISOString()
      : null;
    onSubmit({
      clientId: formData.clientId,
      priceList: formData.priceList,
      ivaPercent: formData.ivaPercent,
      validUntil: validUntilISO,
      items: formData.items.map(({ serviceId, quantity }) => ({
        serviceId,
        quantity,
      })),
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const calculateDisplayPrices = () => {
    let subtotal = 0;
    formData.items.forEach((item) => {
      const service = safeServices.find((s) => s.id === item.serviceId);
      if (service) {
        const price =
          formData.priceList === "ESTUDIANTE"
            ? +service.priceStudent
            : +service.priceExternal;
        subtotal += price * item.quantity;
      }
    });
    const iva = subtotal * (formData.ivaPercent / 100);
    const total = subtotal + iva;
    return { subtotal: subtotal || 0, iva: iva || 0, total: total || 0 };
  };

  const totals = calculateDisplayPrices();
  const selectedClient = safeClients.find((c) => c.id === formData.clientId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0">
      {/* Notificación de éxito animada */}
      {showSuccess && (
        <div
          className="fixed top-4 right-4 z-50 bg-white border px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-4 fade-in duration-300"
          style={{ borderColor: "#009933" }}
        >
          <div
            className="rounded-full p-1"
            style={{ backgroundColor: "#E8F5E9" }}
          >
            <CheckCircle className="w-5 h-5" style={{ color: "#009933" }} />
          </div>
          <div className="flex-1">
            <p className="font-semibold" style={{ color: "#009933" }}>
              ¡Cotización guardada!
            </p>
            <p className="text-sm" style={{ color: "#666666" }}>
              Los datos se han registrado correctamente.
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl border p-4 sm:p-8 space-y-6 sm:space-y-8"
        style={{ borderColor: "#E5E5E5" }}
      >
        {/* Encabezado */}
        <div
          className="border-b pb-4 sm:pb-6"
          style={{ borderColor: "#E5E5E5" }}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "#009933", fontFamily: "'Trajan Pro Bold', serif" }}
          >
            Nueva Cotización
          </h2>
          <p
            className="text-xs sm:text-sm mt-1"
            style={{ color: "#666666", fontFamily: "'Montserrat', sans-serif" }}
          >
            Complete los datos para generar una cotización profesional
          </p>
        </div>

        {/* Alertas */}
        {safeClients.length === 0 && (
          <div
            className="border rounded-xl p-4 flex items-start gap-3 shadow-sm"
            style={{ backgroundColor: "#FFF9E8", borderColor: "#FFCC33" }}
          >
            <AlertCircle
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: "#FFCC33" }}
            />
            <div className="text-sm font-medium" style={{ color: "#996600" }}>
              No hay clientes disponibles. Debe crear clientes primero.
            </div>
          </div>
        )}
        {safeServices.length === 0 && (
          <div
            className="border rounded-xl p-4 flex items-start gap-3 shadow-sm"
            style={{ backgroundColor: "#FFF9E8", borderColor: "#FFCC33" }}
          >
            <AlertCircle
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: "#FFCC33" }}
            />
            <div className="text-sm font-medium" style={{ color: "#996600" }}>
              No hay servicios disponibles. Debe crear servicios primero.
            </div>
          </div>
        )}

        {/* Sección Cliente y Precios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <Select
              label="Cliente *"
              value={formData.clientId}
              onChange={(value) => {
                const client = safeClients.find((c) => c.id === value);
                let priceList = formData.priceList;
                if (client?.email?.endsWith("@utm.edu.ec"))
                  priceList = "ESTUDIANTE";
                else if (client?.email) priceList = "EXTERNO";
                setFormData({ ...formData, clientId: value, priceList });
              }}
              options={clientOptions}
              disabled={safeClients.length === 0}
              placeholder="Seleccionar cliente"
              icon={Building2}
            />
            {selectedClient?.email && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: selectedClient.email.endsWith("@utm.edu.ec")
                    ? "#E8F5E9"
                    : "#FFF9E8",
                  color: selectedClient.email.endsWith("@utm.edu.ec")
                    ? "#009933"
                    : "#FFCC33",
                }}
              >
                <User className="w-3 h-3" />
                {selectedClient.email.endsWith("@utm.edu.ec")
                  ? "Estudiante UTM"
                  : "Cliente Externo"}
              </div>
            )}
          </div>

          <div>
            <Select
              label="Lista de Precios *"
              value={formData.priceList}
              onChange={(value) =>
                setFormData({ ...formData, priceList: value })
              }
              options={priceListOptions}
              required
              icon={Tag}
            />
          </div>
        </div>

        {/* IVA y Validez */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Input
            label="IVA %"
            type="number"
            value={formData.ivaPercent}
            onChange={(e) =>
              setFormData({ ...formData, ivaPercent: +e.target.value || 0 })
            }
            min="0"
            max="100"
            step="1"
            icon={Percent}
          />
          <DatePicker
            label="Válido hasta"
            value={formData.validUntil}
            onChange={(date) => {
              const dateString = date ? date.toISOString().split("T")[0] : "";
              setFormData({ ...formData, validUntil: dateString });
            }}
            minDate={new Date()}
          />
        </div>

        {/* Agregar análisis */}
        <div
          className="rounded-xl p-4 sm:p-6 space-y-4 border"
          style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}
        >
          <h3
            className="text-base sm:text-lg font-semibold flex items-center gap-2"
            style={{ color: "#009933", fontFamily: "'Montserrat', sans-serif" }}
          >
            <Plus
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: "#009933" }}
            />
            Agregar Análisis
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={selectedService}
              onChange={setSelectedService}
              options={serviceOptions}
              disabled={safeServices.length === 0}
              placeholder="Seleccionar análisis"
              className="flex-1"
              icon={Package}
            />
            <QuantityInput
              value={quantity}
              onChange={setQuantity}
              min={1}
              disabled={safeServices.length === 0}
            />
            <Button
              type="button"
              onClick={addItem}
              variant="secondary"
              disabled={!selectedService || safeServices.length === 0}
              className="sm:w-auto w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>

        {/* Lista de items */}
        {formData.items.length > 0 && (
          <div className="space-y-4">
            <h3
              className="text-base sm:text-lg font-semibold"
              style={{
                color: "#009933",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Análisis seleccionados
            </h3>

            {/* Vista móvil: tarjetas */}
            <div className="sm:hidden space-y-3">
              {formData.items.map((item, idx) => {
                const service = safeServices.find(
                  (s) => s.id === item.serviceId,
                );
                if (!service) return null;
                const unitPrice =
                  formData.priceList === "ESTUDIANTE"
                    ? +service.priceStudent
                    : +service.priceExternal;
                const subtotal = unitPrice * item.quantity;

                return (
                  <div
                    key={idx}
                    className="bg-white border rounded-xl p-4 space-y-3"
                    style={{ borderColor: "#E5E5E5" }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div
                          className="font-medium"
                          style={{ color: "#333333" }}
                        >
                          {service.name}
                        </div>
                        <div
                          className="text-xs flex items-center gap-1 mt-1"
                          style={{ color: "#666666" }}
                        >
                          <Hash className="w-3 h-3" />
                          {service.code}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        className="p-1 transition-colors"
                        style={{ color: "#FECACA" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#DC2626")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#FECACA")
                        }
                        title="Eliminar análisis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div
                        className="p-2 rounded-lg text-center"
                        style={{ backgroundColor: "#F9F9F9" }}
                      >
                        <p className="text-xs" style={{ color: "#666666" }}>
                          Cantidad
                        </p>
                        <p
                          className="font-mono font-medium"
                          style={{ color: "#333333" }}
                        >
                          {item.quantity}
                        </p>
                      </div>
                      <div
                        className="p-2 rounded-lg text-center"
                        style={{ backgroundColor: "#F9F9F9" }}
                      >
                        <p className="text-xs" style={{ color: "#666666" }}>
                          P.Unit.
                        </p>
                        <p
                          className="font-mono font-medium"
                          style={{ color: "#333333" }}
                        >
                          ${unitPrice.toLocaleString("es-CL")}
                        </p>
                      </div>
                      <div
                        className="p-2 rounded-lg text-center"
                        style={{ backgroundColor: "#E8F5E9" }}
                      >
                        <p className="text-xs" style={{ color: "#666666" }}>
                          Subtotal
                        </p>
                        <p
                          className="font-mono font-medium"
                          style={{ color: "#009933" }}
                        >
                          ${subtotal.toLocaleString("es-CL")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vista desktop: tabla */}
            <div
              className="hidden sm:block border rounded-xl overflow-hidden shadow-sm"
              style={{ borderColor: "#E5E5E5" }}
            >
              <table className="w-full text-sm">
                <thead
                  className="border-b"
                  style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}
                >
                  <tr>
                    <th
                      className="px-6 py-3 text-left font-medium"
                      style={{ color: "#666666" }}
                    >
                      Análisis
                    </th>
                    <th
                      className="px-6 py-3 text-right font-medium"
                      style={{ color: "#666666" }}
                    >
                      Cant.
                    </th>
                    <th
                      className="px-6 py-3 text-right font-medium"
                      style={{ color: "#666666" }}
                    >
                      P.Unit.
                    </th>
                    <th
                      className="px-6 py-3 text-right font-medium"
                      style={{ color: "#666666" }}
                    >
                      Subtotal
                    </th>
                    <th
                      className="px-6 py-3 text-center font-medium"
                      style={{ color: "#666666" }}
                    >
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "#E5E5E5" }}>
                  {formData.items.map((item, idx) => {
                    const service = safeServices.find(
                      (s) => s.id === item.serviceId,
                    );
                    if (!service) return null;
                    const unitPrice =
                      formData.priceList === "ESTUDIANTE"
                        ? +service.priceStudent
                        : +service.priceExternal;
                    const subtotal = unitPrice * item.quantity;
                    return (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4">
                          <div
                            className="font-medium"
                            style={{ color: "#333333" }}
                          >
                            {service.name}
                          </div>
                          <div
                            className="text-xs flex items-center gap-1"
                            style={{ color: "#666666" }}
                          >
                            <Hash className="w-3 h-3" />
                            {service.code}
                          </div>
                        </td>
                        <td
                          className="px-6 py-4 text-right font-mono"
                          style={{ color: "#333333" }}
                        >
                          {item.quantity}
                        </td>
                        <td
                          className="px-6 py-4 text-right font-mono"
                          style={{ color: "#333333" }}
                        >
                          ${unitPrice.toLocaleString("es-CL")}
                        </td>
                        <td
                          className="px-6 py-4 text-right font-mono font-medium"
                          style={{ color: "#009933" }}
                        >
                          ${subtotal.toLocaleString("es-CL")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="transition p-1 rounded-full hover:bg-red-50"
                            style={{ color: "#FECACA" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = "#DC2626")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = "#FECACA")
                            }
                            title="Eliminar análisis"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="flex justify-end">
              <div
                className="w-full sm:max-w-sm rounded-xl p-4 sm:p-6 space-y-3 border shadow-sm"
                style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#666666" }}>Subtotal</span>
                  <span className="font-medium" style={{ color: "#333333" }}>
                    ${totals.subtotal.toLocaleString("es-CL")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#666666" }}>
                    IVA ({formData.ivaPercent}%)
                  </span>
                  <span className="font-medium" style={{ color: "#333333" }}>
                    ${totals.iva.toLocaleString("es-CL")}
                  </span>
                </div>
                <div
                  className="border-t pt-3 flex justify-between text-base sm:text-lg font-bold"
                  style={{ borderColor: "#E5E5E5" }}
                >
                  <span style={{ color: "#666666" }}>Total</span>
                  <span style={{ color: "#009933" }}>
                    ${totals.total.toLocaleString("es-CL")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div
          className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t"
          style={{ borderColor: "#E5E5E5" }}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={formData.items.length === 0 || !formData.clientId}
            className="w-full sm:w-auto"
          >
            Guardar Cotización
          </Button>
        </div>
      </form>
    </div>
  );
}
