import { writable, get as getStore } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import Conf from './Conf.js';

// Settings Store in Local Storage
// Get the value out of storage on load
// Update & set defaults using Conf
const stored = new Conf(JSON.parse(localStorage.getItem('settings') ?? '{}'));

// Set the stored value
export const settings = writable(stored)

// Anytime the store changes, update the local storage value.
settings.subscribe((value) => localStorage.settings = JSON.stringify(value))

//  Modals Store
export const modals = writable([]); 

export const addModal = (modal) => {
  // Create a unique ID so we can easily find/remove it
  // if it is dismissible/has a timeout.
  modal.id = uuidv4();
    
  // Push the modal to the top of the list of modala
  modals.update((all) => [{ ...modal }, ...all]);

  return modal;
};

export const dismissModal = (id) => {
  modals.update((all) => all.filter((t) => t.id !== id));
};


// Toasts Store
export const toasts = writable([]);

export const addToast = (toast) => {
  // Create a unique ID so we can easily find/remove it
  // if it is dismissible/has a timeout.
  const id = uuidv4();

  if (getStore(settings).toastArt) {
    toast.timeout = null;
  }

  // Setup some sensible defaults for a toast.
  const defaults = {
    id,
    type: "info",
    dismissible: true,
    timeout: 3000,
  };

  // Push the toast to the top of the list of toasts
  toasts.update((all) => [{ ...defaults, ...toast }, ...all]);

  // If toast is dismissible, dismiss it after "timeout" amount of time.
  if (toast.timeout) setTimeout(() => dismissToast(id), toast.timeout);
};

export const dismissToast = (id) => {
  toasts.update((all) => all.filter((t) => t.id !== id));
};