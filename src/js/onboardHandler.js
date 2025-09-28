import { startOnboarding } from './onboarding.js';

const userData = {
  name: 'Lạc Học',
  email: 'hoclac1225@gmail.com',
  phone: '0327525280'
};

startOnboarding(userData).then(res => console.log(res));
