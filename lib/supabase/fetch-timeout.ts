// fetch con límite de tiempo para los clientes de Supabase. Si el proyecto no
// responde (por ejemplo, porque el plan gratuito lo pausó), la request falla
// rápido con AuthRetryableFetchError en lugar de colgar el proxy o la función
// hasta el timeout de Vercel (504).
export function fetchWithTimeout(ms: number): typeof fetch {
  return (input, init) => {
    const timeout = AbortSignal.timeout(ms)
    const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout
    return fetch(input, { ...init, signal })
  }
}
