"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, CheckCircle, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/dxf",
  "application/sla",
  "model/step",
  "application/step",
  "application/octet-stream",
];

export function ContactForm() {
  const t = useTranslations("contact");
  const v = useTranslations("contact.validation");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const schema = z.object({
    name: z.string().min(1, v("nameRequired")),
    email: z.string().min(1, v("emailRequired")).email(v("emailInvalid")),
    phone: z.string().min(1, v("phoneRequired")),
    serviceType: z.string().min(1, v("serviceRequired")),
    material: z.string().min(1, v("materialRequired")),
    quantity: z.string().optional(),
    deadline: z.string().optional(),
    message: z.string().min(1, v("messageRequired")),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus("sending");

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const fileInput = fileInputRef.current;
      if (fileInput?.files?.[0]) {
        formData.append("attachment", fileInput.files[0]);
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        reset();
        setFileName(null);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileName(null);
        return;
      }
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-primary/30 bg-primary/5 p-12 text-center">
        <CheckCircle className="mb-4 h-12 w-12 text-primary" />
        <p className="text-lg font-medium">{t("form.success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-xl font-semibold">{t("form.title")}</h3>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {t("form.error")}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("form.name")} *</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("form.email")} *</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">{t("form.phone")} *</Label>
          <Input id="phone" type="tel" {...register("phone")} />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t("form.serviceType")} *</Label>
          <Select onValueChange={(val) => setValue("serviceType", val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="turning">
                {t("form.serviceOptions.turning")}
              </SelectItem>
              <SelectItem value="milling">
                {t("form.serviceOptions.milling")}
              </SelectItem>
              <SelectItem value="cutting">
                {t("form.serviceOptions.cutting")}
              </SelectItem>
              <SelectItem value="other">
                {t("form.serviceOptions.other")}
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.serviceType && (
            <p className="text-xs text-destructive">
              {errors.serviceType.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>{t("form.material")} *</Label>
          <Select onValueChange={(val) => setValue("material", val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="steel">
                {t("form.materialOptions.steel")}
              </SelectItem>
              <SelectItem value="stainless">
                {t("form.materialOptions.stainless")}
              </SelectItem>
              <SelectItem value="aluminum">
                {t("form.materialOptions.aluminum")}
              </SelectItem>
              <SelectItem value="brass">
                {t("form.materialOptions.brass")}
              </SelectItem>
              <SelectItem value="other">
                {t("form.materialOptions.other")}
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.material && (
            <p className="text-xs text-destructive">
              {errors.material.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">{t("form.quantity")}</Label>
          <Input id="quantity" type="number" min="1" {...register("quantity")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">{t("form.deadline")}</Label>
          <Input id="deadline" type="date" {...register("deadline")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("form.message")} *</Label>
        <Textarea id="message" rows={5} {...register("message")} />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>{t("form.attachment")}</Label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border p-4 transition-colors hover:border-primary/50"
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              {fileName || t("form.attachment")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("form.attachmentHint")}
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.dxf,.step,.stp,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("form.sending")}
          </>
        ) : (
          t("form.submit")
        )}
      </Button>
    </form>
  );
}
