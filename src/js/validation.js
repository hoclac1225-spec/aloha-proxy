// validation.js

export function validateUser(user) {
  if (!user.name || user.name.trim() === '') {
    return 'Name is required';
  }
  if (!user.email || !user.email.includes('@')) {
    return 'Invalid email';
  }
  if (!user.phone || !/^\d{10,15}$/.test(user.phone)) {
    return 'Invalid phone number';
  }
  return null; // hợp lệ
}
