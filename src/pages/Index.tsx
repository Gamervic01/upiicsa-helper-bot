import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <img
            src="https://www.upiicsa.ipn.mx/assets/files/upiicsa/Inicio/LOGO-UPIICSA.png"
            alt="UPIICSA Logo"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Asistente Virtual UPIICSA
          </h1>
          <p className="text-gray-600">
            Respuestas rápidas a tus consultas sobre trámites y servicios
          </p>
        </div>
        
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;