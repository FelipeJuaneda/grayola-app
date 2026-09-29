// @tsparticles/react 4.4 publica sus tipos en la raíz del paquete pero su
// package.json apunta a ./lib/index.d.ts, que no existe. Este shim declara
// la misma API pública hasta que lo corrijan upstream.
declare module "@tsparticles/react" {
  import type { Container, Engine, ISourceOptions } from "@tsparticles/engine"
  import type { CSSProperties, FC, PropsWithChildren } from "react"

  export interface IParticlesProps {
    id?: string
    options?: ISourceOptions
    url?: string
    style?: CSSProperties
    className?: string
    particlesLoaded?: (container?: Container) => Promise<void> | void
  }

  export type ParticlesPluginRegistrar = (engine: Engine) => Promise<void>

  export interface IParticlesProviderProps extends PropsWithChildren {
    init: ParticlesPluginRegistrar
  }

  export const Particles: FC<IParticlesProps>
  export const ParticlesProvider: FC<IParticlesProviderProps>
  export function useParticlesProvider(): { loaded: boolean }
  export default Particles
}
