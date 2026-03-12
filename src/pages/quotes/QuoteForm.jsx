// components/quotes/QuoteForm.jsx - Diseño Profesional con Selects Mejorados
import { useState, Fragment } from "react";
import { Trash2, Plus, AlertCircle, CheckCircle, User, Calendar, DollarSign, ChevronUpDown, Check } from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";

// Componente Select personalizado con búsqueda (usa Listbox de Headless UI)
const Select = ({ label, value, onChange, options = [], disabled, placeholder = "Seleccionar..." }) => {
  const selected = options.find(opt => opt.value === value) || null;

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <Listbox value={selected} onChange={(opt) => onChange(opt?.value || "")} disabled={disabled}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm">
            <span className="block truncate">
              {selected ? selected.label : <span className="text-gray-400">{placeholder}</span>}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                      active ? "bg-blue-50 text-blue-600" : "text-gray-900"
                    }`
                  }
                  value={opt}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                        {opt.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
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
        className="px-3 py-2 border border-gray-200 rounded-l-xl bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        −
      </button>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || min)}
        disabled={disabled}
        className="w-16 text-center border-t border-b border-gray-200 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled}
        className="px-3 py-2 border border-gray-200 rounded-r-xl bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        +
      </button>
    </div>
  );
};

// Mantenemos el Button y Input sin cambios (ya estaban bien)
const Button = ({ children, variant = "primary", className = "", disabled, onClick, type = "button" }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300",
  };
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", className = "", error, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      type={type}
      className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
        error ? "border-red-300" : "border-gray-200"
      } ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// Componente principal
export default function QuoteForm({ clients, services, initialData = {}, onSubmit, onCancel }) {
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

  // Convertir arrays a opciones para los selects
  const clientOptions = safeClients.map(c => ({ value: c.id, label: c.name }));
  const serviceOptions = safeServices.map(s => ({ 
    value: s.id, 
    label: `${s.code} – ${s.name} ($${s.priceExternal})` 
  }));
  const priceListOptions = [
    { value: "EXTERNO", label: "Externo" },
    { value: "ESTUDIANTE", label: "Estudiante" },
  ];

  const addItem = () => {
    if (!selectedService) {
      alert("Selecciona un servicio");
      return;
    }
    const service = safeServices.find((s) => s.id === selectedService);
    if (!service) {
      alert("Servicio no encontrado");
      return;
    }
    setFormData({
      ...formData,
      items: [...formData.items, { serviceId: service.id, serviceName: service.name, serviceCode: service.code, quantity }],
    });
    setSelectedService("");
    setQuantity(1);
  };

  const removeItem = (index) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validUntilISO = formData.validUntil ? new Date(formData.validUntil).toISOString() : null;
    onSubmit({
      clientId: formData.clientId,
      priceList: formData.priceList,
      ivaPercent: formData.ivaPercent,
      validUntil: validUntilISO,
      items: formData.items.map(({ serviceId, quantity }) => ({ serviceId, quantity })),
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const calculateDisplayPrices = () => {
    let subtotal = 0;
    formData.items.forEach((item) => {
      const service = safeServices.find((s) => s.id === item.serviceId);
      if (service) {
        const price = formData.priceList === "ESTUDIANTE" ? +service.priceStudent : +service.priceExternal;
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
    <div className="max-w-5xl mx-auto">
      {/* Notificación de éxito animada */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-green-200 text-green-800 px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="bg-green-100 rounded-full p-1">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">¡Cotización guardada!</p>
            <p className="text-sm text-green-600">Los datos se han registrado correctamente.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-8">
        {/* Encabezado */}
        <div className="border-b border-gray-100 pb-6">
          <h2 className="text-3xl font-bold text-gray-800">Nueva Cotización</h2>
          <p className="text-sm text-gray-400 mt-1">Complete los datos para generar una cotización profesional</p>
        </div>

        {/* Alertas */}
        {safeClients.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-amber-800 text-sm font-medium">No hay clientes disponibles. Debe crear clientes primero.</div>
          </div>
        )}
        {safeServices.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-amber-800 text-sm font-medium">No hay servicios disponibles. Debe crear servicios primero.</div>
          </div>
        )}

        {/* Sección Cliente y Precios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Select
              label="Cliente *"
              value={formData.clientId}
              onChange={(value) => {
                const client = safeClients.find((c) => c.id === value);
                let priceList = formData.priceList;
                if (client?.email?.endsWith("@utm.edu.ec")) priceList = "ESTUDIANTE";
                else if (client?.email) priceList = "EXTERNO";
                setFormData({ ...formData, clientId: value, priceList });
              }}
              options={clientOptions}
              disabled={safeClients.length === 0}
              placeholder="Seleccionar cliente"
            />
            {selectedClient?.email && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                selectedClient.email.endsWith("@utm.edu.ec")
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {selectedClient.email.endsWith("@utm.edu.ec") ? <User className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {selectedClient.email.endsWith("@utm.edu.ec") ? "Estudiante UTM" : "Cliente Externo"}
              </div>
            )}
          </div>

          <div>
            <Select
              label="Lista de Precios *"
              value={formData.priceList}
              onChange={(value) => setFormData({ ...formData, priceList: value })}
              options={priceListOptions}
              required
            />
          </div>
        </div>

        {/* IVA y Validez */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="IVA %"
            type="number"
            value={formData.ivaPercent}
            onChange={(e) => setFormData({ ...formData, ivaPercent: +e.target.value || 0 })}
            min="0"
            max="100"
            step="1"
          />
          <Input
            label="Válido hasta"
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
          />
        </div>

        {/* Agregar análisis */}
        <div className="bg-gray-50/80 rounded-xl p-6 space-y-4 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
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
              className="sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>

        {/* Lista de items */}
        {formData.items.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Análisis seleccionados</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-600">Análisis</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-600">Cant.</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-600">P.Unit.</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-600">Subtotal</th>
                    <th className="px-6 py-3 text-center font-medium text-gray-600">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formData.items.map((item, idx) => {
                    const service = safeServices.find((s) => s.id === item.serviceId);
                    if (!service) return null;
                    const unitPrice = formData.priceList === "ESTUDIANTE" ? +service.priceStudent : +service.priceExternal;
                    const subtotal = unitPrice * item.quantity;
                    return (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">{service.name}</div>
                          <div className="text-xs text-gray-400">{service.code}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono">{item.quantity}</td>
                        <td className="px-6 py-4 text-right font-mono">${unitPrice.toLocaleString("es-CL")}</td>
                        <td className="px-6 py-4 text-right font-mono font-medium">${subtotal.toLocaleString("es-CL")}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-red-400 hover:text-red-600 transition p-1 rounded-full hover:bg-red-50"
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
              <div className="w-full max-w-sm bg-gray-50/80 rounded-xl p-6 space-y-3 border border-gray-100 shadow-sm">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800">${totals.subtotal.toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">IVA ({formData.ivaPercent}%)</span>
                  <span className="font-medium text-gray-800">${totals.iva.toLocaleString("es-CL")}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                  <span className="text-gray-700">Total</span>
                  <span className="text-blue-600">${totals.total.toLocaleString("es-CL")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={formData.items.length === 0 || !formData.clientId}
          >
            Guardar Cotización
          </Button>
        </div>
      </form>
    </div>
  );
}