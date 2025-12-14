import React, { useState, ChangeEvent } from 'react';
import { DogProfile } from '../types';
import { Upload, PawPrint, Calendar, Scissors, Weight, Info, Droplets, Heart, Award, Clock, Plus, X, List, ChevronDown, ChevronUp } from 'lucide-react';

interface DogFormProps {
  onSubmit: (data: DogProfile) => void;
  onCancel: () => void;
}

const SERVICES = [
  { id: 'Baño', label: 'Baño', icon: <Droplets size={20} /> },
  { id: 'Baño y Corte', label: 'Baño y Corte', icon: <Scissors size={20} /> },
  { id: 'Adiestramiento', label: 'Adiestramiento', icon: <Award size={20} /> },
  { id: 'Terapias Holísticas', label: 'Terapias Holísticas', icon: <Heart size={20} /> },
];

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const PRESET_DAYS = [
  { label: 'Días de semana', value: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] },
  { label: 'Fines de semana', value: ['Sábado', 'Domingo'] }
];

const TIMES = ['Por la mañana', 'Mediodía', 'Por la tarde'];

const DogForm: React.FC<DogFormProps> = ({ onSubmit, onCancel }) => {
  // Initialize state
  const [formData, setFormData] = useState<Partial<DogProfile>>({
    dogName: '',
    ownerName: '',
    phone: '',
    breed: '',
    hairType: 'Corto',
    weight: '',
    age: '',
    serviceType: 'Baño',
    availabilityDays: [],
    availabilityTime: [],
    customTags: [],
    notes: '',
    photoUrl: null
  });

  const [newTag, setNewTag] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDay = (day: string) => {
    setFormData(prev => {
      const days = prev.availabilityDays || [];
      if (days.includes(day)) {
        return { ...prev, availabilityDays: days.filter(d => d !== day) };
      } else {
        return { ...prev, availabilityDays: [...days, day] };
      }
    });
  };

  const toggleTime = (time: string) => {
    setFormData(prev => {
        const times = prev.availabilityTime || [];
        if (times.includes(time)) {
            return { ...prev, availabilityTime: times.filter(t => t !== time) };
        } else {
            return { ...prev, availabilityTime: [...times, time] };
        }
    });
  };

  const selectPresetDays = (days: string[]) => {
    setFormData(prev => ({ ...prev, availabilityDays: days }));
  };

  const addCustomTag = () => {
      if (newTag.trim()) {
          setFormData(prev => ({
              ...prev,
              customTags: [...(prev.customTags || []), newTag.trim()]
          }));
          setNewTag('');
      }
  };

  const removeCustomTag = (tagToRemove: string) => {
      setFormData(prev => ({
          ...prev,
          customTags: (prev.customTags || []).filter(tag => tag !== tagToRemove)
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.dogName || !formData.ownerName || !formData.phone || !formData.photoUrl || (formData.availabilityTime?.length === 0) || (formData.availabilityDays?.length === 0)) {
        alert("Por favor completa los campos requeridos: Foto, Nombre, Dueño, Teléfono y Disponibilidad (Días y Horarios).");
        return;
    }

    const fullProfile: DogProfile = {
        dogName: formData.dogName!,
        ownerName: formData.ownerName!,
        phone: formData.phone!,
        breed: formData.breed || '',
        hairType: formData.hairType || 'Corto',
        weight: formData.weight || '',
        age: formData.age || '',
        serviceType: formData.serviceType || 'Baño',
        availabilityDays: formData.availabilityDays || [],
        availabilityTime: formData.availabilityTime || [],
        customTags: formData.customTags || [],
        notes: formData.notes || '',
        photoUrl: formData.photoUrl!,
        createdAt: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
    };

    onSubmit(fullProfile);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in mb-10">
      <div className="bg-indigo-600 p-6 text-center">
        <h2 className="text-2xl font-bold text-white flex justify-center items-center gap-2">
          <PawPrint className="w-8 h-8" />
          Registro de Mascota
        </h2>
        <p className="text-indigo-100 mt-2">Completa los datos para generar tu Credencial Canina</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Top Section: Photo & Basic Info */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Photo Upload */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="relative w-40 h-40 rounded-full border-4 border-indigo-100 overflow-hidden bg-slate-100 group shadow-md hover:shadow-lg transition">
                    {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Upload className="w-10 h-10 mb-2" />
                        <span className="text-sm font-medium">Subir Foto</span>
                    </div>
                    )}
                    <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">* Obligatorio</p>
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                 {/* Dog Name */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Nombre del Perro</label>
                    <input
                    type="text"
                    name="dogName"
                    required
                    value={formData.dogName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                 {/* Owner Name */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Nombre del Dueño</label>
                    <input
                    type="text"
                    name="ownerName"
                    required
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                 {/* Phone */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                 {/* Breed */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Raza</label>
                    <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>
        </div>

        <div className="h-px bg-gray-100 w-full"></div>

        {/* Physical Details (Reduced) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Peso (kg)</label>
                <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                />
            </div>
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Edad</label>
                <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                />
            </div>
        </div>

        {/* Collapsible Details Section */}
        <div className="bg-orange-50 rounded-xl border border-orange-100 overflow-hidden transition-all">
            <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-5 bg-orange-50 hover:bg-orange-100 transition text-left focus:outline-none"
            >
                <div className="flex items-center gap-2 text-orange-700 font-semibold">
                    <List size={20} />
                    <h3>Detalles y Características <span className="text-sm font-normal text-orange-600 opacity-80">(Opcional)</span></h3>
                </div>
                {showDetails ? <ChevronUp size={20} className="text-orange-500"/> : <ChevronDown size={20} className="text-orange-500"/>}
            </button>
            
            {showDetails && (
                <div className="p-5 pt-0 space-y-5 border-t border-orange-200 mt-0">
                     <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Hair Type Moved Here */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tipo de Pelo</label>
                            <select
                            name="hairType"
                            value={formData.hairType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                            >
                            <option value="Corto">Corto</option>
                            <option value="Largo">Largo</option>
                            <option value="Rizado">Rizado</option>
                            <option value="Duro">Duro / Alambre</option>
                            <option value="Doble Capa">Doble Capa</option>
                            </select>
                        </div>

                        {/* Custom Tags */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Agregar Etiquetas Personalizadas</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Ej. Nudos, Piel sensible..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                                />
                                <button 
                                    type="button"
                                    onClick={addCustomTag}
                                    className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.customTags?.map((tag, idx) => (
                                    <span key={idx} className="bg-white border border-orange-200 text-orange-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                                        {tag}
                                        <button type="button" onClick={() => removeCustomTag(tag)} className="text-orange-400 hover:text-orange-900"><X size={12}/></button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Service Selection */}
        <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                <Scissors size={18} className="text-indigo-600"/> Tipo de Servicio
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SERVICES.map(service => (
                    <button
                        key={service.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, serviceType: service.id }))}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                            formData.serviceType === service.id 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <div className="mb-2">{service.icon}</div>
                        <span className="text-xs font-semibold text-center">{service.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Improved Availability */}
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
            <Calendar size={18} className="text-indigo-600"/> Disponibilidad Horaria
          </label>
          
          {/* Days */}
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {PRESET_DAYS.map(preset => (
                     <button
                        key={preset.label}
                        type="button"
                        onClick={() => selectPresetDays(preset.value)}
                        className="text-xs bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition"
                     >
                        {preset.label}
                     </button>
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
                {DAYS.map(day => {
                    const isSelected = formData.availabilityDays?.includes(day);
                    return (
                        <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`px-3 py-2 text-sm rounded-lg border transition ${
                                isSelected 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>
          </div>

          {/* Time Slots (Multi-select) */}
          <div className="pt-2">
            <p className="text-xs text-gray-500 mb-2 font-medium">Preferencia Horaria (Selecciona varias):</p>
            <div className="flex flex-wrap gap-3">
                {TIMES.map(time => {
                    const isSelected = formData.availabilityTime?.includes(time);
                    return (
                        <button
                            key={time}
                            type="button"
                            onClick={() => toggleTime(time)}
                            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 p-2 rounded-lg border transition text-sm ${
                                isSelected
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500 shadow-sm'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Clock size={14} />
                            {time}
                        </button>
                    );
                })}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
            <Info size={18} className="text-red-500"/> Observaciones / Alergias o Patologías
          </label>
          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Ej. Es tímido, alergia al pollo, displasia de cadera..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
            Cancelar
            </button>
            <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md"
            >
            Crear Credencial
            </button>
        </div>
      </form>
    </div>
  );
};

export default DogForm;