declare module "*.json" {
  interface anyObject {
    [key: string]: any
  }
  const value: anyObject
  export = value
}