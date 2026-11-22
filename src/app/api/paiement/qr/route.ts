import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

/**
 * Génère un QR code PNG réel et scannable pour le paiement Wave.
 * Le contenu encode la référence, le montant et la devise : il est donc
 * lisible par n'importe quel lecteur de QR (téléphone, zbar, douchette).
 *
 * ⚠️ Démonstration : ce QR n'est relié à aucune API Wave réelle.
 */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const montant = Math.max(0, Math.round(Number(params.get('montant') ?? '0')));
  const reference = (params.get('ref') ?? 'KOLATIER-DEMO').replace(/[^A-Za-z0-9\-]/g, '').slice(0, 32);

  // Charge utile du QR : schéma de paiement + paramètres lisibles
  const contenu = `wave://pay?merchant=KOLATIER&ref=${reference}&amount=${montant}&currency=XOF&mode=DEMO`;

  try {
    const png = await QRCode.toBuffer(contenu, {
      type: 'png',
      width: 520,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0b2a4a', light: '#ffffff' },
    });

    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': String(png.length),
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch {
    return NextResponse.json({ erreur: 'QR code indisponible.' }, { status: 500 });
  }
}
