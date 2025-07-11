import React, { Component, ErrorInfo } from 'react';
import { logError } from '../firebase';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const details = `Component stack: ${errorInfo.componentStack}`;
    logError({ error, context: 'ErrorBoundary', details });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#1C2526] text-[#FFFFFF]">
          <div className="p-8 rounded-xl bg-[#00A6A6] text-[#1C2526] font-bold text-xl">
            <h1>Something went wrong.</h1>
            <p>{this.state.error?.message}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

/**
 * Sugerencias de pruebas unitarias (Vitest):
 *
 * 1. Renderiza hijos correctamente cuando no hay error.
 * 2. Captura errores de renderizado y muestra mensaje traducido.
 * 3. Llama a logError y muestra notificación toast al ocurrir un error.
 * 4. El botón "Reload page" recarga la ventana.
 * 5. Accesibilidad: el contenedor tiene role="alert" y aria-live="assertive".
 * 6. El mensaje de error se muestra en el idioma seleccionado.
 */
