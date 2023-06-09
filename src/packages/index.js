import PuzzleVerify from "./PuzzleVerify"

const components = [PuzzleVerify]

export default install = (Vue) => {
  components.forEach((component) => {
    Vue.component(component.name, component)
  })
}