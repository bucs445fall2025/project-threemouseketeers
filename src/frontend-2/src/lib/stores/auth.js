import { writable } from "svelte/store";
import { api } from "$lib/api";

export const user = writable(null);

export async function hydrateUser() {
  const res = await api("/me");
  if (res.ok) {
    const data = await res.json();
    console.log(`data is`, data);
    user.set(data.user);
  } else {
    console.log('api call not working right whoopsie daisy');
    user.set(null);

  }
}