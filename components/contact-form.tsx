"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, CheckCircle, AlertCircle, Calendar } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const SERVICE_OPTIONS = ["turning", "milling", "cutting", "other"] as const;
const MATERIAL_OPTIONS = ["steel", "stainless", "aluminum", "brass", "plastic", "other"] as const;

export function ContactForm() {
  const t = useTranslations("contact");
  const v = useTranslations("contact.validation");
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [gdprError, setGdprError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const schema = z.object({
    name: z.string().min(1, v("nameRequired")),
    email: z.string().min(1, v("emailRequired")).email(v("emailInvalid")),
    phone: z.string().min(1, v("phoneRequired")),
    materialType: z.string().optional(),
    quantity: z.string().optional(),
    message: z.string().min(1, v("messageRequired")),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [serviceError, setServiceError] = useState<string | null>(null);
  const [materialError, setMaterialError] = useState<string | null>(null);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
    setServiceError(null);
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
    setMaterialError(null);
  };

  const onSubmit = async (data: FormData) => {
    // Validate checkboxes
    if (selectedServices.length === 0) {
      setServiceError(v("serviceRequired"));
      return;
    }
    if (selectedMaterials.length === 0) {
      setMaterialError(v("materialRequired"));
      return;
    }
    if (!gdprConsent) {
      setGdprError(v("gdprRequired"));
      return;
    }

    setStatus("sending");

    try {
      // Get reCAPTCHA token
      if (!executeRecaptcha) {
        setStatus("error");
        return;
      }
      const recaptchaToken = await executeRecaptcha("contact_form");

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Add reCAPTCHA token
      formData.append("recaptchaToken", recaptchaToken);

      // Add deadline manually
      const deadline = dateInputRef.current?.value;
      if (deadline) formData.append("deadline", deadline);

      // Add selected services and materials
      formData.append("serviceTypes", selectedServices.join(", "));
      formData.append("materials", selectedMaterials.join(", "));

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
        setSelectedServices([]);
        setSelectedMaterials([]);
        setGdprConsent(false);
        if (dateInputRef.current) dateInputRef.current.value = "";
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

      <div className="space-y-2">
        <Label htmlFor="phone">{t("form.phone")} *</Label>
        <Input id="phone" type="tel" {...register("phone")} />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>

      {/* Services - Checkboxes */}
      <div className="space-y-3">
        <Label>{t("form.serviceType")} *</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SERVICE_OPTIONS.map((service) => (
            <label
              key={service}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 transition-colors hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <Checkbox
                checked={selectedServices.includes(service)}
                onCheckedChange={() => toggleService(service)}
              />
              <span className="text-sm">{t(`form.serviceOptions.${service}`)}</span>
            </label>
          ))}
        </div>
        {serviceError && (
          <p className="text-xs text-destructive">{serviceError}</p>
        )}
      </div>

      {/* Materials - Checkboxes */}
      <div className="space-y-3">
        <Label>{t("form.material")} *</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {MATERIAL_OPTIONS.map((material) => (
            <label
              key={material}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 transition-colors hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <Checkbox
                checked={selectedMaterials.includes(material)}
                onCheckedChange={() => toggleMaterial(material)}
              />
              <span className="text-sm">{t(`form.materialOptions.${material}`)}</span>
            </label>
          ))}
        </div>
        {materialError && (
          <p className="text-xs text-destructive">{materialError}</p>
        )}
      </div>

      {/* Material specification */}
      <div className="space-y-2">
        <Label htmlFor="materialType">{t("form.materialType")}</Label>
        <Input
          id="materialType"
          placeholder={t("form.materialTypePlaceholder")}
          {...register("materialType")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="quantity">{t("form.quantity")}</Label>
          <Input id="quantity" type="number" min="1" {...register("quantity")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">{t("form.deadline")}</Label>
          <div className="relative">
            <input
              ref={dateInputRef}
              id="deadline"
              type="date"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
            <button
              type="button"
              onClick={() => dateInputRef.current?.showPicker()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
            >
              <Calendar className="h-5 w-5" />
            </button>
          </div>
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

      {/* GDPR Consent */}
      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox
            checked={gdprConsent}
            onCheckedChange={(checked) => {
              setGdprConsent(checked === true);
              setGdprError(null);
            }}
            className="mt-0.5"
          />
          <span className="text-sm text-muted-foreground">
            {t("form.gdprConsent")}{" "}
            <a
              href="/privacy"
              target="_blank"
              className="text-primary underline hover:no-underline"
            >
              {t("form.gdprLink")}
            </a>
          </span>
        </label>
        {gdprError && (
          <p className="text-xs text-destructive">{gdprError}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full text-base font-semibold" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("form.sending")}
          </>
        ) : (
          t("form.submit")
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("form.bottomNote")}
      </p>
    </form>
  );
}
