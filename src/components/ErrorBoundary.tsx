import React, { Component, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { logError } from '../firebase';

/**
 * Props para ErrorBoundary.
 */
interface ErrorBoundaryProps extends WithTranslation {
  children: ReactNode;
}

/**
 * Estado para ErrorBoundary.
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Componente ErrorBoundary para manejo global de errores.
 * Captura errores de renderizado, muestra notificaciones traducidas,
 * y registra detalles en consola y logError para depuración.
 * Accesible y compatible con mobile-first.
 */
class ErrorBoundaryBase extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    logError({ error, errorInfo });
    // Notificación accesible y traducida
    toast.error(this.props.t('An unexpected error occurred'), {
      position: 'top-center',
      autoClose: 8000,
      theme: 'colored',
      toastId: 'global-error',
      role: 'alert',
    });
    // Log estructurado para depuración
     
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { t, children } = this.props;

    if (hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center min-h-screen p-8"
          style={{ background: '#1C2526', color: '#FFFFFF' }}
          role="alert"
          aria-live="assertive"
        >
          <div className="bg-[#23272f] rounded-xl shadow-lg p-8 max-w-lg w-full text-center border-2 border-[#00A6A6]">
            <h1 className="text-3xl font-bold mb-4" style={{ color: '#00A6A6' }}>
              {t('Something went wrong')}
            </h1>
            <p className="mb-2">{t('An unexpected error occurred')}</p>
            {error?.message && (
              <pre className="bg-[#1C2526] text-[#00A6A6] rounded p-2 mt-4 text-sm overflow-x-auto" aria-label={t('Error details')}>
                {error.message}
              </pre>
            )}
            <button
              className="mt-6 px-6 py-3 bg-[#00A6A6] text-[#FFFFFF] rounded-xl font-bold shadow hover:bg-[#009090] transition"
              onClick={() => window.location.reload()}
              aria-label={t('Reload page')}
            >
              {t('Reload page')}
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Envolver con withTranslation para soporte i18next
const ErrorBoundary = withTranslation()(ErrorBoundaryBase);

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