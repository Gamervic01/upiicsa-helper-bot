import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Progress } from "@/components/ui/progress";

export const DataUpdateForm = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);

    try {
      await FirecrawlService.initializeApp(apiKey);
      
      toast({
        title: "Iniciando actualización",
        description: "Comenzando a extraer datos de UPIICSA...",
        duration: 3000,
      });

      setProgress(25);

      const result = await FirecrawlService.crawlUPIICSA();

      if (!result.success) {
        throw new Error(result.error || 'Error desconocido');
      }

      setProgress(75);

      // Procesar los datos y actualizar chatData
      FirecrawlService.processScrapedData(result.data);

      setProgress(100);
      
      toast({
        title: "¡Éxito!",
        description: "Los datos han sido actualizados correctamente",
        duration: 5000,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar los datos",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
            API Key de Firecrawl
          </label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Ingresa tu API key"
            required
          />
        </div>

        {isLoading && (
          <Progress value={progress} className="w-full" />
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Actualizando datos..." : "Actualizar datos de UPIICSA"}
        </Button>
      </form>
    </div>
  );
};