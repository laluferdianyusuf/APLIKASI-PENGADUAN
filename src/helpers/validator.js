export function nameValidator(name) {
  if (!name) return "Nama tidak boleh kosong.";
  return "";
}

export function usernameValidator(username) {
  if (!username) return "Username tidak boleh kosong.";
  return "";
}

export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/;
  if (!email) return "Email tidak boleh kosong.";
  if (!re.test(email)) return "Ooops! Email tidak valid.";
  return "";
}

export function numberValidator(phoneNumber) {
  if (!phoneNumber) return "Nomor Telepon tidak boleh kosong.";
  return "";
}

export function addressValidator(address) {
  if (!address) return "Alamat tidak boleh kosong.";
  return "";
}

export function passwordValidator(password) {
  if (!password) return "Password tidak boleh kosong.";
  if (password.length < 8) return "Password minimal 8 karakter.";
  return "";
}
