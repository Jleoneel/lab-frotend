// components/quotes/EditQuoteModal.jsx
import { useState, useEffect, Fragment } from "react";
import { Trash2, Plus, X, Search, ChevronsUpDown, Check } from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { serviceService } from "../../services/serviceService";
import { clientService } from "../../services/clientService";
import DatePicker from "../../components/ui/DatePicker";
import { quoteService } from '../../services/quoteService';


// Select personalizado con búsqueda
const SearchableSelect = ({
  label,
  value,
  onChange,
  options = [],
  disabled,
  placeholder = "Seleccionar...",
}) => {
  const [query, setQuery] = useState("");

  const selected = options.find((opt) => opt.value === value) || null;

  const filteredOptions =
    query === ""
      ? options
      : options.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Listbox
        value={selected}
        onChange={(opt) => onChange(opt?.value || "")}
        disabled={disabled}
      >
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-300 transition-colors">
            <span className="block truncate">
              {selected ? (
                selected.label
              ) : (
                <span className="text-gray-400">{placeholder}</span>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronsUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <div className="sticky top-0 z-10 bg-white px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Buscar..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              {filteredOptions.length === 0 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-500 text-center">
                  No se encontraron resultados
                </div>
              ) : (
                filteredOptions.map((opt) => (
                  <Listbox.Option
                    key={opt.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2.5 pl-10 pr-4 ${
                        active ? "bg-blue-50 text-blue-600" : "text-gray-900"
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
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <Check className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

// Select simple (para lista de precios)
const SimpleSelect = ({ label, value, onChange, options = [], disabled }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-300 transition-colors appearance-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: "right 0.75rem center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "1.5em 1.5em",
        paddingRight: "2.5rem",
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

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

export default function EditQuoteModal({ isOpen, onClose, quote, onSaved }) {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    clientId: "",
    priceList: "EXTERNO",
    ivaPercent: 19,
    validUntil: "",
    items: [],
  });

  const [selectedService, setSelectedService] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen && quote) {
      loadData();
    }
  }, [isOpen, quote]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clientsRes, servicesRes] = await Promise.all([
        clientService.getAll(),
        serviceService.getActive(),
      ]);

      setClients(clientsRes.data || []);
      setServices(servicesRes.data || []);

      // Pre-cargar datos de la cotización
      setFormData({
        clientId: quote.clientId,
        priceList: quote.priceList,
        ivaPercent: parseFloat(quote.ivaPercent) || 19,
        validUntil: quote.validUntil
          ? new Date(quote.validUntil).toISOString().split("T")[0]
          : "",
        items: quote.items.map((item) => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          serviceCode: item.serviceCode,
          quantity: item.quantity,
        })),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
  const service = services.find(s => s.id === selectedService);
  if (!service) return;

  // Verificar si el servicio ya existe en los items
  const existingIndex = formData.items.findIndex(i => i.serviceId === service.id);
  
  if (existingIndex >= 0) {
    // Ya existe — sumar cantidad
    const newItems = [...formData.items];
    newItems[existingIndex].quantity += quantity;
    setFormData({ ...formData, items: newItems });
  } else {
    // No existe — agregar nuevo
    setFormData({
      ...formData,
      items: [...formData.items, {
        serviceId: service.id,
        serviceName: service.name,
        serviceCode: service.code,
        quantity
      }]
    });
  }

  setSelectedService('');
  setQuantity(1);
};

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const calculateTotals = () => {
    let subtotal = 0;
    formData.items.forEach((item) => {
      const service = services.find((s) => s.id === item.serviceId);
      if (service) {
        const price =
          formData.priceList === "ESTUDIANTE"
            ? parseFloat(service.priceStudent)
            : parseFloat(service.priceExternal);
        subtotal += price * item.quantity;
      }
    });
    const iva = subtotal * (formData.ivaPercent / 100);
    return { subtotal, iva, total: subtotal + iva };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await quoteService.update(quote.id, {
        clientId: formData.clientId,
        priceList: formData.priceList,
        ivaPercent: formData.ivaPercent,
        validUntil: formData.validUntil
          ? new Date(formData.validUntil).toISOString()
          : null,
        items: formData.items.map((i) => ({
          serviceId: i.serviceId,
          quantity: i.quantity,
        })),
      });
      onSaved();
      onClose();
    } catch (e) {
      alert("Error al guardar: " + (e.response?.data?.message || e.message));
    } finally {
      setSaving(false);
    }
  };

  const totals = calculateTotals();

  // Preparar opciones para selects
  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }));
  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: `${s.code} – ${s.name} ($${s.priceExternal})`,
  }));
  const priceListOptions = [
    { value: "EXTERNO", label: "Externo" },
    { value: "ESTUDIANTE", label: "Estudiante" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Cotización"
      size="lg"
    >
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando datos...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Cliente y Lista de Precios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label="Cliente *"
              value={formData.clientId}
              onChange={(value) =>
                setFormData({ ...formData, clientId: value })
              }
              options={clientOptions}
              placeholder="Seleccionar cliente"
            />

            <SimpleSelect
              label="Lista de Precios *"
              value={formData.priceList}
              onChange={(value) =>
                setFormData({ ...formData, priceList: value })
              }
              options={priceListOptions}
            />
          </div>
          {/* IVA y Validez */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="IVA %"
              type="number"
              value={formData.ivaPercent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ivaPercent: parseFloat(e.target.value) || 0,
                })
              }
              min="0"
              max="100"
              step="1"
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
          <div className="bg-gray-50/80 rounded-xl p-5 space-y-3 border border-gray-100">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-500" />
              Agregar Análisis
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <SearchableSelect
                  value={selectedService}
                  onChange={setSelectedService}
                  options={serviceOptions}
                  placeholder="Seleccionar análisis"
                />
              </div>
              <QuantityInput value={quantity} onChange={setQuantity} min={1} />
              <Button
                type="button"
                variant="secondary"
                onClick={addItem}
                disabled={!selectedService}
                className="sm:w-auto whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>
          {/* Tabla de items */}
          {formData.items.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">
                Análisis seleccionados ({formData.items.length})
              </p>
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">
                        Análisis
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">
                        Cant.
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">
                        P/U
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">
                        Subtotal
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {formData.items.map((item, index) => {
                      const service = services.find(
                        (s) => s.id === item.serviceId,
                      );
                      const unitPrice = service
                        ? formData.priceList === "ESTUDIANTE"
                          ? parseFloat(service.priceStudent)
                          : parseFloat(service.priceExternal)
                        : 0;
                      return (
                        <tr
                          key={index}
                          className="hover:bg-gray-50/50 transition"
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">
                              {item.serviceName}
                            </div>
                            <div className="text-xs text-gray-400">
                              {item.serviceCode}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right font-mono">
                            ${unitPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-medium">
                            ${(unitPrice * item.quantity).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-400 hover:text-red-600 transition p-1.5 rounded-full hover:bg-red-50"
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
                <div className="w-full max-w-xs bg-gray-50/80 rounded-xl p-5 space-y-2 border border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-800 font-mono">
                      ${totals.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      IVA ({formData.ivaPercent}%)
                    </span>
                    <span className="font-medium text-gray-800 font-mono">
                      ${totals.iva.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold">
                    <span className="text-gray-700">Total</span>
                    <span className="text-blue-600 font-mono">
                      ${totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-5 border-t border-gray-100 mt-5">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || formData.items.length === 0 || !formData.clientId}
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </Modal>
  );
}
