"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function AdminLogoutButton() {
  const router = useRouter();

  async function onLogout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message ?? "로그아웃에 실패했습니다.");
      return;
    }
    toast.success("로그아웃되었습니다.");
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onLogout}
      className="w-full justify-start gap-2 text-warm-gray hover:text-primary-navy"
    >
      <LogOut className="size-4" aria-hidden />
      로그아웃
    </Button>
  );
}
