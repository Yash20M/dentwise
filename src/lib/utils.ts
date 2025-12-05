import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const generateAvatar = (name: string, gender: "MALE" | "FEMALE") => {
  const username = name.replace(/\s+/g, "").toLowerCase();
  const base = "https://avatar.iran.liara.run/public";
  if (gender === "FEMALE") return `${base}/girl/username=${username}`;
  return `${base}/boy/username=${username}`
}

export const formatPhoneNumber = (value: string) => {
  if (!value) return value;

  let phoneNumber = value.replace(/[^\d]/g, "");

  if (phoneNumber.length < 10) return phoneNumber;

  if (phoneNumber.length > 10) {
    phoneNumber = phoneNumber.slice(-10)
  }

  if (phoneNumber.length >= 10) {
    return `${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`
  }

  if(phoneNumber.length <=12){
    return `+${phoneNumber.slice(0,2)} ${phoneNumber.slice(2,7)} ${phoneNumber.slice(7,12)}`
  }
  return `+${phoneNumber.slice(0,2)} ${phoneNumber.slice(2,7)} ${phoneNumber.slice(7,12)}`
}