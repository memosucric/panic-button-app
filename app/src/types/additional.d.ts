declare type Maybe<T> = T | null

declare type ComponentProps = {
  children?: React.ReactNode
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}
