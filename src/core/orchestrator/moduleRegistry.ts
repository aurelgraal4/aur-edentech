type ModuleMap = Map<string, any>

const modules: ModuleMap = new Map()

export function register(name: string, module: any) {
  modules.set(name, module)
}

export function get(name: string) {
  return modules.get(name)
}

export function list() {
  return Array.from(modules.keys())
}

export default { register, get, list }
