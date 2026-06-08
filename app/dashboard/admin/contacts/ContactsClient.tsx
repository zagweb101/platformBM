"use client";

import { useState, useTransition } from "react";
import { updateContactMessageStatus } from "@/actions/contact.actions";
import { toast } from "sonner";
import { Mail, Loader2, CheckCircle, Eye } from "lucide-react";
import type { ContactStatus } from "@prisma/client";
import {
  AdminDesktopActions,
  AdminMobileActions,
  type AdminActionItem,
} from "@/components/dashboard/admin/AdminActionsMenu";

interface ContactItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
}

const STATUS_LABELS: Record<ContactStatus, string> = {
  NEW: "جديدة",
  READ: "مقروءة",
  REPLIED: "تم الرد",
};

export default function ContactsClient({
  initialMessages,
}: {
  initialMessages: ContactItem[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStatus = (id: string, status: ContactStatus) => {
    setProcessingId(id);
    startTransition(async () => {
      const res = await updateContactMessageStatus(id, status);
      setProcessingId(null);
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else if ("success" in res && res.success) {
        toast.success(res.success);
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status } : m))
        );
      }
    });
  };

  const newCount = messages.filter((m) => m.status === "NEW").length;

  const getContactActions = (msg: ContactItem): AdminActionItem[] => {
    const loading = isPending && processingId === msg.id;
    const actions: AdminActionItem[] = [
      {
        id: "toggle",
        label: expandedId === msg.id ? "إخفاء الرسالة" : "عرض الرسالة",
        onClick: () => setExpandedId(expandedId === msg.id ? null : msg.id),
      },
    ];

    if (msg.status === "NEW") {
      actions.push({
        id: "read",
        label: "تحديد كمقروءة",
        onClick: () => handleStatus(msg.id, "READ"),
        disabled: loading,
        loading,
      });
    }

    if (msg.status !== "REPLIED") {
      actions.push({
        id: "replied",
        label: "تم الرد",
        onClick: () => handleStatus(msg.id, "REPLIED"),
        disabled: loading,
        loading,
      });
    }

    actions.push({
      id: "email",
      label: "رد بالبريد",
      onClick: () => {
        window.location.href = `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`;
      },
    });

    return actions;
  };

  return (
    <div className="space-y-6 admin-form-shell">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-text-primary mb-1">رسائل التواصل</h2>
          <p className="text-sm text-text-secondary">
            {messages.length} رسالة — {newCount} جديدة
          </p>
        </div>
        <Mail className="w-8 h-8 text-brand-indigo" />
      </div>

      {messages.length === 0 ? (
        <div className="card-brand p-8 text-center text-text-secondary text-sm">
          لا توجد رسائل بعد.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="card-brand bg-card p-5 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-text-primary">{msg.subject}</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    {msg.name} — {msg.email}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {new Date(msg.createdAt).toLocaleString("ar-SA")}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                    msg.status === "NEW"
                      ? "bg-amber-500/10 text-amber-500"
                      : msg.status === "REPLIED"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-secondary text-text-muted"
                  }`}
                >
                  {STATUS_LABELS[msg.status]}
                </span>
              </div>

              {expandedId === msg.id ? (
                <p className="text-sm text-text-secondary whitespace-pre-wrap border-t border-subtle pt-3">
                  {msg.message}
                </p>
              ) : (
                <p className="text-sm text-text-muted line-clamp-2">{msg.message}</p>
              )}

              <div className="border-t border-subtle pt-3">
                <AdminDesktopActions>
                  <button
                    type="button"
                    onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                    className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-subtle px-3 text-xs font-semibold hover:bg-secondary"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {expandedId === msg.id ? "إخفاء" : "عرض"}
                  </button>
                  {msg.status === "NEW" && (
                    <button
                      type="button"
                      disabled={isPending && processingId === msg.id}
                      onClick={() => handleStatus(msg.id, "READ")}
                      className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-brand-indigo/10 px-3 text-brand-indigo text-xs font-semibold"
                    >
                      {isPending && processingId === msg.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      تحديد كمقروءة
                    </button>
                  )}
                  {msg.status !== "REPLIED" && (
                    <button
                      type="button"
                      disabled={isPending && processingId === msg.id}
                      onClick={() => handleStatus(msg.id, "REPLIED")}
                      className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-emerald-500/10 px-3 text-emerald-500 text-xs font-semibold"
                    >
                      تم الرد
                    </button>
                  )}
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-subtle px-3 text-xs font-semibold hover:bg-secondary"
                  >
                    رد بالبريد
                  </a>
                </AdminDesktopActions>
                <AdminMobileActions actions={getContactActions(msg)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
