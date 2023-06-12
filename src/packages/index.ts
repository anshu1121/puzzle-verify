import { App } from 'vue'
import PuzzleVerify from "./PuzzleVerify"

const components = [PuzzleVerify]

const AnTestUI = {
  install(Vue: App) {
    components.forEach((component) => {
      Vue.component(component.name, component);
    });
  },
};
export default AnTestUI