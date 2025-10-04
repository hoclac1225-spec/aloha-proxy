import { startOnboarding } from './onboarding.js';

const userData = {
  name: 'Láº¡c Há»c',
  email: 'hoclac1225@gmail.com',
  phone: '0327525280'
};

startOnboarding(userData).then(res => console.log(res));
