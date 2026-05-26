/**
 * In-app replacement for `window.confirm()`.
 *
 * Tauri's WebView blocks native `confirm()`/`alert()` dialogs by default —
 * the call returns `undefined` synchronously and the calling code thinks
 * the user cancelled. Every "Delete X?" guard in the app was silently
 * failing on the desktop build. Using our own Svelte modal keeps the
 * familiar `if (!await confirmAction(...)) return` shape while working in
 * both the web and Tauri builds.
 *
 * Render `<ConfirmDialog />` once in the root layout; `confirmAction()` is
 * the only API callers need.
 */
import { tick } from 'svelte';

type Pending = {
  message: string;
  detail?: string;
  confirmLabel: string;
  destructive: boolean;
  resolve: (ok: boolean) => void;
};

class ConfirmState {
  pending = $state<Pending | null>(null);

  /** Returns a promise that resolves true if the user confirmed. */
  async ask(opts: {
    message: string;
    detail?: string;
    confirmLabel?: string;
    destructive?: boolean;
  }): Promise<boolean> {
    // If another confirm is already on screen, resolve it as cancelled
    // before showing the new one — keeps the queue from getting stuck.
    if (this.pending) this.pending.resolve(false);
    await tick();
    return new Promise<boolean>((resolve) => {
      this.pending = {
        message: opts.message,
        detail: opts.detail,
        confirmLabel: opts.confirmLabel ?? 'Delete',
        destructive: opts.destructive ?? true,
        resolve
      };
    });
  }

  resolve(ok: boolean) {
    if (!this.pending) return;
    const { resolve } = this.pending;
    this.pending = null;
    resolve(ok);
  }
}

export const confirmStore = new ConfirmState();

/**
 * Show a confirmation modal. Resolves true if the user clicks the confirm
 * button, false if they cancel or dismiss.
 *
 * Accepts either a plain string (used as the headline message) or an
 * options object for richer prompts.
 */
export function confirmAction(
  arg: string | { message: string; detail?: string; confirmLabel?: string; destructive?: boolean }
): Promise<boolean> {
  if (typeof arg === 'string') return confirmStore.ask({ message: arg });
  return confirmStore.ask(arg);
}
