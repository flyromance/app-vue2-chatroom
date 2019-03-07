import Vue from "Vue";
import App from "./index.vue";
// console.log(123);
new Vue({
  render(h) {
    return h(App, { id: "app" });
  }
}).$mount("#app");
