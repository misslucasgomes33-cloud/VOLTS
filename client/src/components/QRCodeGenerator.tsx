import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRCodeGeneratorProps {
  type: 'cliente' | 'motoboy' | 'parceiro';
  url: string;
}

export default function QRCodeGenerator({ type, url }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  
  const getColors = () => {
    switch(type) {
      case 'cliente': return { bg: '#FFCC00', fg: '#000000', label: 'VOLTS Cliente', icon: '🍔' };
      case 'motoboy': return { bg: '#3B82F6', fg: '#FFFFFF', label: 'VOLTS Entregador', icon: '🛵' };
      case 'parceiro': return { bg: '#EF4444', fg: '#FFFFFF', label: 'VOLTS Parceiros', icon: '🏪' };
      default: return { bg: '#FFFFFF', fg: '#000000', label: 'VOLTS', icon: '⚡' };
    }
  };
  
  const colors = getColors();

  const downloadQR = () => {
    const canvas = document.createElement("canvas");
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    
    // Create a new canvas to draw the SVG and styling
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = 1080;
    canvas.height = 1080;
    
    // Draw background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Convert SVG to data URL properly handling characters
    const svgData = new XMLSerializer().serializeToString(svg);
    // Use encodeURIComponent to handle special characters correctly before base64 encoding
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      // Draw white background for QR
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(140, 240, 800, 800);
      
      // Draw QR code
      ctx.drawImage(img, 190, 290, 700, 700);
      
      // Draw Title
      ctx.fillStyle = colors.bg;
      ctx.font = "bold 80px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Baixe o app ${colors.label}`, 540, 150);
      
      // Draw website
      ctx.fillStyle = "#AAAAAA";
      ctx.font = "40px sans-serif";
      ctx.fillText("appvolts.com.br", 540, 1000);
      
      // Trigger download
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `volts-qr-${type}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
      DOMURL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-zinc-900 border border-white/10 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{colors.icon}</span>
        <h3 className="font-bold text-white text-lg">{colors.label}</h3>
      </div>
      
      <div className="bg-white p-4 rounded-xl mb-4" ref={qrRef}>
        <QRCodeSVG 
          value={url} 
          size={180} 
          level="H"
          includeMargin={true}
          imageSettings={{
            src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5Z29uIHBvaW50cz0iMTMgMiAzIDE0IDEyIDE0IDExIDIyIDIxIDEwIDEyIDEwIDEzIDIiPjwvcG9seWdvbj48L3N2Zz4=", // Simple zap icon
            x: undefined,
            y: undefined,
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
      </div>
      
      <p className="text-[10px] text-zinc-400 text-center mb-4 px-4 h-8">
        Escaneie para {type === 'cliente' ? 'fazer pedidos' : type === 'motoboy' ? 'ser entregador' : 'cadastrar restaurante'}
      </p>
      
      <div className="flex w-full gap-2">
        <Button onClick={downloadQR} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold h-10 gap-2">
          <Download className="w-4 h-4" /> PNG
        </Button>
      </div>
    </div>
  );
}
