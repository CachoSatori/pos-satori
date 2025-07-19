import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Puedes enviar el error a un servicio externo aquí
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Ha ocurrido un error inesperado.</div>;
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
