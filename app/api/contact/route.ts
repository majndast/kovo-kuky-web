import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const serviceType = formData.get("serviceType") as string;
    const material = formData.get("material") as string;
    const quantity = formData.get("quantity") as string;
    const deadline = formData.get("deadline") as string;
    const message = formData.get("message") as string;
    const attachment = formData.get("attachment") as File | null;

    if (!name || !email || !phone || !serviceType || !material || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const serviceLabels: Record<string, string> = {
      turning: "Soustružení",
      milling: "Frézování",
      cutting: "Řezání",
      other: "Jiné",
    };

    const materialLabels: Record<string, string> = {
      steel: "Ocel",
      stainless: "Nerez",
      aluminum: "Hliník",
      brass: "Mosaz",
      other: "Jiné",
    };

    const htmlContent = `
      <h2>Nová poptávka z webu KOVO-KUKY</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Jméno</td><td style="padding: 8px; border: 1px solid #ddd;">${name}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Telefon</td><td style="padding: 8px; border: 1px solid #ddd;">${phone}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Typ služby</td><td style="padding: 8px; border: 1px solid #ddd;">${serviceLabels[serviceType] || serviceType}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Materiál</td><td style="padding: 8px; border: 1px solid #ddd;">${materialLabels[material] || material}</td></tr>
        ${quantity ? `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Počet kusů</td><td style="padding: 8px; border: 1px solid #ddd;">${quantity}</td></tr>` : ""}
        ${deadline ? `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Termín</td><td style="padding: 8px; border: 1px solid #ddd;">${deadline}</td></tr>` : ""}
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Zpráva</td><td style="padding: 8px; border: 1px solid #ddd;">${message.replace(/\n/g, "<br>")}</td></tr>
      </table>
    `;

    const emailOptions: Parameters<typeof resend.emails.send>[0] = {
      from: "KOVO-KUKY Web <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL || "info@kovo-kuky.cz"],
      replyTo: email,
      subject: `Poptávka z webu: ${serviceLabels[serviceType] || serviceType} - ${name}`,
      html: htmlContent,
    };

    if (attachment && attachment.size > 0) {
      const buffer = Buffer.from(await attachment.arrayBuffer());
      emailOptions.attachments = [
        {
          filename: attachment.name,
          content: buffer,
        },
      ];
    }

    await resend.emails.send(emailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
