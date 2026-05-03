"use client";

import { useEffect, useState, type RefObject } from "react";
import { useUnsavedWarning } from "./useUnsavedWarning";

/**
 * useState 기반 폼에서 input/change 이벤트를 capture하여 dirty 상태 추적.
 * react-hook-form 폼은 form.formState.isDirty 사용을 권장.
 */
export function useFormDirty(
  formRef: RefObject<HTMLFormElement | null>,
  options: { pending?: boolean; saved?: boolean } = {},
) {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const handler = () => setDirty(true);
    form.addEventListener("input", handler);
    form.addEventListener("change", handler);
    return () => {
      form.removeEventListener("input", handler);
      form.removeEventListener("change", handler);
    };
  }, [formRef]);

  useUnsavedWarning(dirty && !options.pending && !options.saved);

  return { dirty, reset: () => setDirty(false) };
}
