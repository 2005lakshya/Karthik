export const NAME_REGEX = /^[A-Za-z][A-Za-z\s'.-]{1,48}$/;
export const PHONE_REGEX = /^(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateLeadForm(data) {
  const errors = {};

  const firstName = data.firstName.trim();
  const lastName = data.lastName.trim();
  const phone = data.phone.trim();
  const email = data.email.trim();

  if (!NAME_REGEX.test(firstName)) {
    errors.firstName = 'Use letters only, 2 to 50 characters.';
  }

  if (!NAME_REGEX.test(lastName)) {
    errors.lastName = 'Use letters only, 2 to 50 characters.';
  }

  if (!PHONE_REGEX.test(phone)) {
    errors.phone = 'Enter a valid Canadian phone number.';
  }

  if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!data.province) {
    errors.province = 'Select your province.';
  }

  return errors;
}