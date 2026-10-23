"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Warns before leaving a form with unsaved edits. It listens to input events on
 * the surrounding form, so no field has to opt in.
 */
export function UnsavedGuard({ formId, message }: { formId: string; message: string }) {
  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(false);

  useEffect(() => {
    const form = document.getElementById(formId);
    if (!form) return;

    function markDirty() {
      if (!dirtyRef.current) {
        dirtyRef.current = true;
        setDirty(true);
      }
    }

    function clearDirty() {
      dirtyRef.current = false;
      setDirty(false);
    }

    form.addEventListener("input", markDirty);
    form.addEventListener("submit", clearDirty);

    function beforeUnload(event: BeforeUnloadEvent) {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = message;
    }

    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      form.removeEventListener("input", markDirty);
      form.removeEventListener("submit", clearDirty);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [formId, message]);

  if (!dirty) return null;

  return (
    <p role="status" className="text-sm text-muted">
      Unsaved changes — save before leaving this page.
    </p>
  );
}
