import { VueQueryPlugin } from '@tanstack/vue-query';
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { tRPCClient } from './trpc.mts';

const app = createApp(App);

app.provide('trpc', tRPCClient);
app.use(VueQueryPlugin);
app.mount('#app');
