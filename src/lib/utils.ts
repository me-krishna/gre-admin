import { type ClassValue, clsx } from "clsx"
import Swal from "sweetalert2"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function successMsg(msg: string) {
  Swal.fire({
    title: "Success",
    text: msg,
    icon: "success",
    showConfirmButton: true,
    timer: 1500,
  })
}

export function errorMsg(msg: string) {
  Swal.fire({
    title: "Error",
    text: msg,
    icon: "error",
    showConfirmButton: true,
  })
}