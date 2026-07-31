"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { TODO, contact } from "@/lib/content";

type State = { status: "idle" | "ok" | "error"; message?: string };

const CONFIGURED = TODO.formspreeId !== "TODO";

async function submit(_prev: State, formData: FormData): Promise<State> {
  if (!CONFIGURED) {
    return {
      status: "error",
      message:
        "The form isn't connected yet. Please email or book a call instead.",
    };
  }

  try {
    const res = await fetch(`https://formspree.io/f/${TODO.formspreeId}`, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      return { status: "ok", message: "Thanks — I'll reply within 24 hours." };
    }

    // Formspree returns field-level errors in an `errors` array.
    const data = (await res.json().catch(() => null)) as {
      errors?: { message: string }[];
    } | null;
    return {
      status: "error",
      message: data?.errors?.[0]?.message ?? "Something went wrong. Try email?",
    };
  } catch {
    return { status: "error", message: "Network error. Try email instead?" };
  }
}

const field =
  "w-full rounded-control border border-line bg-bg px-4 py-3.5 text-sm text-ink placeholder:text-faint transition-colors duration-300 focus:border-accent focus:outline-none";

function SubmitButton() {
  // useFormStatus only reads the enclosing form, so it must live in a child.
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex items-center justify-center rounded-control bg-accent px-7 py-4 font-mono text-xs uppercase tracking-[0.14em] text-bg transition-colors duration-300 ease-expo hover:bg-ink disabled:opacity-50"
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submit, { status: "idle" });

  if (state.status === "ok") {
    return (
      <div className="rounded-card border border-success/30 bg-success/5 p-9">
        <p className="display text-2xl text-success">Message sent.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Name</span>
          <input name="name" required placeholder="Name" className={field} />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className={field}
          />
        </label>
      </div>

      <label className="block">
        <span className="sr-only">Budget range</span>
        <select name="budget" defaultValue="" className={field} required>
          <option value="" disabled>
            Budget range
          </option>
          {contact.budgets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="sr-only">Project description</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="What are you building?"
          className={`${field} resize-y`}
        />
      </label>

      {state.status === "error" ? (
        <p role="alert" className="text-sm text-accent">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
