import { startOnboarding } from './onboarding.js';

const userData = {
  name: 'LÃƒÂ¡Ã‚ÂºÃ‚Â¡c HÃƒÂ¡Ã‚Â»Ã‚Âc',
  email: 'hoclac1225@gmail.com',
  phone: '0327525280'
};

startOnboarding(userData).then(res => console.log(res));
