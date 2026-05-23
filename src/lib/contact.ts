/** Public contact details (phone / social). Email via VITE_CONTACT_EMAIL in .env */
export const CONTACT_PHONE = "71672259";
export const CONTACT_PHONE_E164 = "+96171672259";

export const CONTACT_INSTAGRAM_URL =
  "https://www.instagram.com/a_s_perfumery?igsh=MWdmd2RuMnZsbXhjOQ==";
export const CONTACT_INSTAGRAM_HANDLE = "@a_s_perfumery";

export const DAHER_TECH_INSTAGRAM_URL =
  "https://www.instagram.com/techdaher?igsh=ZThzYzlsdmh3c21u";

export function getContactEmail(): string | null {
  const email = import.meta.env.VITE_CONTACT_EMAIL as string | undefined;
  return email?.trim() || null;
}
