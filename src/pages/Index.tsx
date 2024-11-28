import { ChatInterface } from "@/components/ChatInterface";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="/lovable-uploads/f5d0b981-f909-4467-b448-4489a5c728e2.png"
              alt="UPIICSA Logo"
              className="h-20"
            />
            <img
              src="https://www.ipn.mx/assets/files/main/img/template/pleca-ipn.png"
              alt="IPN Logo"
              className="h-16"
            />
          </div>
          <h1 className="text-4xl font-bold text-ipn-primary dark:text-white mb-4">
            Asistente Virtual UPIICSA
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            ¡Hola! Estoy aquí para ayudarte con información sobre trámites, servicios y cualquier duda que tengas sobre UPIICSA. ¡También podemos platicar de forma casual! 😊
          </p>
        </div>
        
        <ChatInterface />

        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas</p>
          <p className="mt-1">Instituto Politécnico Nacional</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;