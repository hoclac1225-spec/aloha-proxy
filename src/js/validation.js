export function validateUser(userData) {
  if (!userData) return "User data is missing";
  if (!userData.name || userData.name.trim() === "") return "Name is required";
  if (!userData.email || userData.email.trim() === "") return "Email is required";
  if (!userData.phone || userData.phone.trim() === "") return "Phone is required";
  return null; // khÃ´ng lá»—i
}
