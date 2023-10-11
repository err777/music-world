import { createApp } from 'vue';
import App from './App.vue';
import router from './index';
import store from './index';
import VeeValidatePlugin from './validation';
import { auth } from './firebase';
import './tailwind.css';
import './main.css';

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);

    app.mount('#app');
  }
});
