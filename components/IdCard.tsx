import React, { useRef, useState } from 'react';
import { DogProfile } from '../types';
import { Download, Check, ArrowLeft, Scissors } from 'lucide-react';

// Declaration for html2canvas to avoid TS errors since it's loaded via CDN
declare global {
  interface Window {
    html2canvas: any;
  }
}

interface IdCardProps {
  data: DogProfile;
  onBack: () => void;
}

const IdCard: React.FC<IdCardProps> = ({ data, onBack }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || !window.html2canvas) return;
    
    setIsDownloading(true);
    try {
      const canvas = await window.html2canvas(cardRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: null, // Transparent background handled by CSS
        useCORS: true,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Credencial_${data.dogName.replace(/\s+/g, '_')}.png`;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Error generating image:", err);
      alert("Hubo un error al generar la imagen. Por favor intenta hacer una captura de pantalla.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Format availability text for display
  const getAvailabilityText = () => {
    if (!data.availabilityDays || data.availabilityDays.length === 0) return '';
    const days = data.availabilityDays.length > 4 
        ? 'Días de semana' // Simplification for many days
        : data.availabilityDays.map(d => d.slice(0, 3)).join(', '); // Lunes -> Lun
    
    // Join times if array, or use string if legacy
    const times = Array.isArray(data.availabilityTime) 
        ? data.availabilityTime.join(', ')
        : data.availabilityTime;

    return `${days} - ${times}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in pb-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">¡Credencial Lista!</h2>
        <p className="text-gray-600 max-w-md">Descarga esta imagen y envíala a la barbería para agilizar tu turno.</p>
      </div>

      {/* The Card Container - This is what gets screenshotted */}
      <div 
        ref={cardRef} 
        className="w-[350px] aspect-[3/5.2] rounded-3xl overflow-hidden shadow-2xl relative bg-white border border-gray-100"
        style={{ fontFamily: 'sans-serif' }}
      >
        {/* Header Background */}
        <div className="absolute top-0 w-full h-36 bg-gradient-to-br from-indigo-800 via-indigo-600 to-purple-700"></div>
        
        {/* Content Layer */}
        <div className="relative z-10 flex flex-col items-center pt-6 px-6 h-full">
            {/* Title */}
            <div className="text-center text-white mb-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                     <Scissors size={16} className="text-white opacity-80" />
                     <div className="font-black text-lg tracking-wide uppercase leading-none">La Barberie</div>
                </div>
                <div className="font-light text-base tracking-widest uppercase leading-none opacity-90 mb-1">de los Perritos</div>
                <p className="text-[6px] uppercase tracking-widest opacity-70">Peluquería Canina Profesional • Adiestramiento • Ludoteca</p>
            </div>

            {/* Photo */}
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 mb-3 relative z-20">
                {data.photoUrl ? (
                    <img src={data.photoUrl} alt={data.dogName} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Sin Foto</div>
                )}
            </div>

            {/* Dog Name */}
            <h1 className="text-3xl font-black text-gray-800 mb-1 uppercase tracking-tight">{data.dogName}</h1>
            
            {/* Service Type Badge */}
            <div className="mb-4 flex flex-col items-center gap-1">
                <span className="px-3 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                    {data.breed || 'Mestizo'}
                </span>
                <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold shadow-sm">
                    {data.serviceType}
                </span>
            </div>

            {/* Grid Stats */}
            <div className="w-full grid grid-cols-2 gap-2 mb-4">
                <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">Edad</p>
                    <p className="font-semibold text-gray-700 text-xs">{data.age || '-'}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">Peso</p>
                    <p className="font-semibold text-gray-700 text-xs">{data.weight || '-'}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">Pelo</p>
                    <p className="font-semibold text-gray-700 text-xs">{data.hairType}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">Dueño</p>
                    <p className="font-semibold text-gray-700 text-xs truncate">{data.ownerName.split(' ')[0]}</p>
                </div>
            </div>

            {/* Custom Tags Display */}
            {data.customTags && data.customTags.length > 0 && (
                 <div className="w-full flex flex-wrap justify-center gap-1 mb-3">
                     {data.customTags.map((tag, i) => (
                         <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-md text-[9px] font-medium uppercase">
                             {tag}
                         </span>
                     ))}
                 </div>
            )}

            {/* Contact & Availability */}
            <div className="w-full space-y-2 flex-grow">
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                   <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                   </div>
                   <div className="overflow-hidden">
                       <p className="text-[9px] text-gray-400 uppercase font-bold">Contacto</p>
                       <p className="text-xs font-semibold text-gray-800">{data.phone}</p>
                   </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                   <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                   </div>
                   <div className="overflow-hidden">
                       <p className="text-[9px] text-gray-400 uppercase font-bold">Disponibilidad</p>
                       <p className="text-[10px] font-semibold text-gray-800 leading-tight">{getAvailabilityText()}</p>
                   </div>
                </div>
                
                {data.notes && (
                    <div className="bg-red-50 p-2 rounded-lg border border-red-100 mt-1">
                        <p className="text-[8px] text-red-400 uppercase font-bold mb-0.5">Alergias / Patologías / Obs.</p>
                        <p className="text-[10px] text-gray-700 leading-snug line-clamp-2">{data.notes}</p>
                    </div>
                )}
            </div>

             {/* Footer Timestamp */}
             <div className="w-full pt-3 pb-1 text-center border-t border-dashed border-gray-200 mt-2">
                <p className="text-[7px] text-gray-400 tracking-widest uppercase">ID Creado: {data.createdAt}</p>
             </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4">
        <button 
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm font-medium"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl shadow-lg font-bold text-white transition transform active:scale-95 ${
            downloadSuccess ? 'bg-green-500' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700'
          }`}
        >
          {isDownloading ? (
             <span>Generando...</span>
          ) : downloadSuccess ? (
             <>
               <Check size={18} /> Guardado
             </>
          ) : (
            <>
               <Download size={18} /> Descargar ID
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default IdCard;