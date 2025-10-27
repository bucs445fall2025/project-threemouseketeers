import { writable } from "svelte/store";
import { api } from "$lib/api";

export const user = writable(null);

export async function hydrateUser() {
  const res = await api("/me");
  if (res.ok) {
    const data = await res.json();
    user.set(data.user);
  } else {
    user.set(null);
  }
}