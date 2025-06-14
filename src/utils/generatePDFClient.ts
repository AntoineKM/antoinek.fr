import jsPDF from "jspdf";

const generatePDFClient = async (
  coverLetter: string,
  companyName: string,
  jobTitle: string,
  language: string,
) => {
  const today = new Date().toLocaleDateString(
    language === "french" ? "fr-FR" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  // Créer le PDF avec fond coloré
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // Fonction pour télécharger et convertir une police en base64
  const loadFontAsBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch font: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = "";
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binaryString);
  };

  // Ajouter la police Satoshi
  try {
    console.log("📁 Loading Satoshi fonts...");

    // Utiliser les URLs TTF car elles fonctionnent mieux avec jsPDF
    const regularUrl =
      "https://cdn.fontshare.com/wf/TTX2Z3BF3P6Y5BQT3IV2VNOK6FL22KUT/7QYRJOI3JIMYHGY6CH7SOIFRQLZOLNJ6/KFIAZD4RUMEZIYV6FQ3T3GP5PDBDB6JY.ttf";
    const boldUrl =
      "https://cdn.fontshare.com/wf/LAFFD4SDUCDVQEXFPDC7C53EQ4ZELWQI/PXCT3G6LO6ICM5I3NTYENYPWJAECAWDD/GHM6WVH6MILNYOOCXHXB5GTSGNTMGXZR.ttf";

    // Télécharger et convertir en base64
    const [regularBase64, boldBase64] = await Promise.all([
      loadFontAsBase64(regularUrl),
      loadFontAsBase64(boldUrl),
    ]);

    // Ajouter les polices à jsPDF avec le format correct
    pdf.addFileToVFS("Satoshi-Regular.ttf", regularBase64);
    pdf.addFont("Satoshi-Regular.ttf", "Satoshi", "normal");

    pdf.addFileToVFS("Satoshi-Bold.ttf", boldBase64);
    pdf.addFont("Satoshi-Bold.ttf", "Satoshi", "bold");

    console.log("✅ Satoshi fonts loaded successfully!");
  } catch (error) {
    console.warn(
      "⚠️ Could not load Satoshi fonts, falling back to helvetica:",
      error,
    );
  }

  // Ajouter le fond #ffffe3
  pdf.setFillColor(255, 255, 227); // #ffffe3 en RGB
  pdf.rect(
    0,
    0,
    pdf.internal.pageSize.getWidth(),
    pdf.internal.pageSize.getHeight(),
    "F",
  );

  // Définir la couleur du texte #10100e
  pdf.setTextColor(16, 16, 14); // #10100e en RGB

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Fonction pour ajouter du texte avec retour à la ligne automatique
  const addText = (
    text: string,
    fontSize: number,
    style: "normal" | "bold" = "normal",
    align: "left" | "center" | "right" = "left",
    color?: [number, number, number],
    extraSpacing: number = 0, // Espacement supplémentaire optionnel
  ) => {
    pdf.setFontSize(fontSize);

    // Utiliser Satoshi si disponible, sinon helvetica
    try {
      pdf.setFont("Satoshi", style);
    } catch (error) {
      pdf.setFont("helvetica", style);
    }

    // Appliquer une couleur spécifique si fournie
    if (color) {
      pdf.setTextColor(color[0], color[1], color[2]);
    } else {
      pdf.setTextColor(16, 16, 14); // Couleur par défaut #10100e
    }

    if (align === "center") {
      pdf.text(text, pageWidth / 2, yPosition, { align: "center" });
      yPosition += fontSize * 0.35 + extraSpacing; // Réduit de 0.5 à 0.35
    } else if (align === "right") {
      pdf.text(text, pageWidth - margin, yPosition, { align: "right" });
      yPosition += fontSize * 0.35 + extraSpacing;
    } else {
      const lines = pdf.splitTextToSize(text, contentWidth);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * fontSize * 0.35 + extraSpacing; // Réduit l'espacement
    }
  };

  // En-tête avec style amélioré
  addText("Antoine Kingue", 22, "bold", "center", undefined, 3);
  addText(jobTitle, 13, "normal", "center", [102, 102, 102], 2);
  addText(
    "contact@antoinek.fr • +33 6 99 72 53 58 • https://antoinek.fr • https://linkedin.com/in/antoinekm",
    10,
    "normal",
    "center",
    [102, 102, 102],
    8,
  );

  // Ligne de séparation élégante
  pdf.setDrawColor(16, 16, 14); // #10100e
  pdf.setLineWidth(0.8);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15; // Réduit de 20 à 15

  // Date et destinataire avec style
  addText(
    `${language === "french" ? "Rouen, le" : "Rouen,"} ${today}`,
    11,
    "normal",
    "left",
    [102, 102, 102],
  );
  yPosition += 5;
  addText(
    `${language === "french" ? "À l'attention de" : "To"} ${companyName}`,
    12,
    "bold",
    "left",
    undefined,
    10,
  );

  // Corps de la lettre avec espacement réduit
  const paragraphs = coverLetter.split("\n").filter((p) => p.trim());
  paragraphs.forEach((paragraph, index) => {
    if (yPosition > 250) {
      // Si on approche du bas de page
      pdf.addPage();
      // Refaire le fond pour la nouvelle page
      pdf.setFillColor(255, 255, 227);
      pdf.rect(
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight(),
        "F",
      );
      pdf.setTextColor(16, 16, 14); // Remettre la couleur du texte
      yPosition = margin;
    }

    addText(paragraph.trim(), 11, "normal", "left");

    // Espacement réduit entre paragraphes (seulement si ce n'est pas le dernier)
    if (index < paragraphs.length - 1) {
      yPosition += 8; // Réduit de 3 + espacement addText à juste 8
    }
  });

  // Signature avec style
  yPosition += 20; // Réduit de 25 à 20
  addText(
    language === "french" ? "Cordialement," : "Sincerely,",
    11,
    "normal",
    "right",
  );
  yPosition += 30; // Réduit de 35 à 30

  // Ligne de signature élégante
  const signatureX = pageWidth - margin - 60;
  pdf.setDrawColor(102, 102, 102);
  pdf.setLineWidth(0.3);
  pdf.line(signatureX, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;
  addText("Antoine Kingue", 10, "normal", "right", [102, 102, 102]);

  // Télécharger le PDF (taille généralement < 300 KB avec police Satoshi)
  pdf.save(
    `antoine-kingue-cl-${companyName.replace(/\s+/g, "_")}.pdf`.toLowerCase(),
  );
};

export default generatePDFClient;
