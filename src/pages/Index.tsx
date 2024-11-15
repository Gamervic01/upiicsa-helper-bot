import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="https://www.upiicsa.ipn.mx/assets/files/upiicsa/Inicio/LOGO-UPIICSA.png"
              alt="UPIICSA Logo"
              className="h-16"
            />
            <img
              src="https://www.ipn.mx/assets/files/main/img/template/pleca-ipn.png"
              alt="IPN Logo"
              className="h-16"
            />
          </div>
          <h1 className="text-4xl font-bold text-ipn-primary mb-4">
            Asistente Virtual UPIICSA
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            ¡Hola! Estoy aquí para ayudarte con información sobre trámites, servicios y dudas generales sobre UPIICSA.
          </p>
        </div>
        
        <ChatInterface />

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas</p>
          <p className="mt-1">Instituto Politécnico Nacional</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;