import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@kovokuky.cz";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "poptavky@kovokuky.cz";

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

    // Email pro KOVO-KUKY (poptávka)
    const inquiryHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Nová poptávka z webu</h2>
        <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
          <tr style="background: #f9fafb;">
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; width: 140px;">Jméno</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Email</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Telefon</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;"><a href="tel:${phone}">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Typ služby</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${serviceLabels[serviceType] || serviceType}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Materiál</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${materialLabels[material] || material}</td>
          </tr>
          ${quantity ? `<tr><td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Počet kusů</td><td style="padding: 12px; border: 1px solid #e5e7eb;">${quantity}</td></tr>` : ""}
          ${deadline ? `<tr style="background: #f9fafb;"><td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Požadovaný termín</td><td style="padding: 12px; border: 1px solid #e5e7eb;">${deadline}</td></tr>` : ""}
        </table>
        <div style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 8px;">
          <strong>Zpráva:</strong>
          <p style="margin-top: 10px; white-space: pre-wrap;">${message}</p>
        </div>
        ${attachment && attachment.size > 0 ? '<p style="margin-top: 15px; color: #6b7280; font-size: 14px;">📎 Příloha připojena k emailu</p>' : ""}
      </div>
    `;

    const inquiryOptions: Parameters<typeof resend.emails.send>[0] = {
      from: `KOVO-KUKY <${FROM_EMAIL}>`,
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `Nová poptávka: ${serviceLabels[serviceType] || serviceType} - ${name}`,
      html: inquiryHtml,
    };

    if (attachment && attachment.size > 0) {
      const buffer = Buffer.from(await attachment.arrayBuffer());
      inquiryOptions.attachments = [
        {
          filename: attachment.name,
          content: buffer,
        },
      ];
    }

    // Potvrzovací email pro zákazníka
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Děkujeme za vaši poptávku</h2>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Dobrý den,<br><br>
          děkujeme za vaši poptávku. Obdrželi jsme ji a již ji zpracováváme.
        </p>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          <strong>Cenovou nabídku vám zašleme do 48 hodin.</strong>
        </p>
        <div style="margin: 25px 0; padding: 20px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #f97316;">
          <strong>Shrnutí vaší poptávky:</strong>
          <ul style="margin-top: 10px; padding-left: 20px; color: #4b5563;">
            <li>Typ služby: ${serviceLabels[serviceType] || serviceType}</li>
            <li>Materiál: ${materialLabels[material] || material}</li>
            ${quantity ? `<li>Počet kusů: ${quantity}</li>` : ""}
            ${deadline ? `<li>Požadovaný termín: ${deadline}</li>` : ""}
          </ul>
        </div>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          V případě dotazů nás neváhejte kontaktovat.
        </p>
        <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 30px;">
          S pozdravem,<br>
          <strong>Tým KOVO-KUKY</strong>
        </p>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
          KOVO-KUKY | CNC obrábění a zakázková výroba<br>
          <a href="https://kovokuky.cz" style="color: #f97316;">www.kovokuky.cz</a>
        </p>
      </div>
    `;

    // Posílání obou emailů paralelně
    await Promise.all([
      resend.emails.send(inquiryOptions),
      resend.emails.send({
        from: `KOVO-KUKY <${FROM_EMAIL}>`,
        to: [email],
        subject: "Potvrzení přijetí poptávky - KOVO-KUKY",
        html: confirmationHtml,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
