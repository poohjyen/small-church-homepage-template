"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

type EditModeValue = {
  isAdmin: boolean;
  enabled: boolean;
  toggle: () => void;
};

const EditModeContext = createContext<EditModeValue>({
  isAdmin: false,
  enabled: false,
  toggle: () => {},
});

const STORAGE_KEY = "site-edit-mode";

// 편집 모드 on/off 를 localStorage 에 두고, 새로고침·탭 이동에도 유지한다.
// useSyncExternalStore 로 읽어 하이드레이션 불일치 없이 클라이언트 값으로 동기화.
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

function setEditMode(value: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    // localStorage 차단 환경 — 무시
  }
  listeners.forEach((l) => l());
}

export function EditModeProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = useCallback(() => {
    setEditMode(!getSnapshot());
  }, []);

  return (
    <EditModeContext.Provider value={{ isAdmin, enabled, toggle }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}
