export async function POST(req: Request) {
  try {
    const { coverLetter, companyName, language } = await req.json();

    if (!coverLetter) {
      return Response.json({ error: "Cover letter content is required" }, { status: 400 });
    }

    // Generate HTML content for PDF
    const htmlContent = generateHTML(coverLetter, companyName, language);

    // In a production environment, you would use Puppeteer for PDF generation:
    // import puppeteer from 'puppeteer';
    // 
    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    // await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    // const pdf = await page.pdf({ 
    //   format: 'A4', 
    //   printBackground: true,
    //   margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    // });
    // await browser.close();
    // 
    // return new Response(pdf, {
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `attachment; filename="Antoine_Kingue_Cover_Letter_${companyName.replace(/\s+/g, '_')}.pdf"`,
    //   },
    // });

    // For now, return HTML that can be printed to PDF by the browser
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="Antoine_Kingue_Cover_Letter_${companyName.replace(/\s+/g, '_')}.html"`,
      },
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    return Response.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

function generateHTML(coverLetter: string, companyName: string, language: string): string {
  const today = new Date().toLocaleDateString(language === 'french' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="${language === 'french' ? 'fr' : 'en'}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cover Letter - Antoine Kingue</title>
        <link rel="preconnect" href="https://api.fontshare.com" crossorigin="anonymous">
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,301,701,300,501,401,901,400&display=swap">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                background-color: #ffffff;
                color: #1a1a1a;
                line-height: 1.6;
                font-size: 14px;
            }
            
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px;
                min-height: 100vh;
                position: relative;
            }
            
            .header {
                text-align: center;
                border-bottom: 2px solid #10100e;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            
            .name {
                font-size: 28px;
                font-weight: 700;
                color: #10100e;
                margin-bottom: 8px;
            }
            
            .title {
                font-size: 16px;
                color: #666;
                margin-bottom: 15px;
            }
            
            .contact-info {
                display: flex;
                justify-content: center;
                gap: 20px;
                flex-wrap: wrap;
                font-size: 12px;
                color: #666;
            }
            
            .contact-item {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .date-location {
                text-align: right;
                margin-bottom: 30px;
                font-size: 12px;
                color: #666;
            }
            
            .content {
                font-size: 14px;
                line-height: 1.8;
                color: #333;
            }
            
            .content p {
                margin-bottom: 15px;
            }
            
            .content h1, .content h2, .content h3 {
                color: #10100e;
                margin-bottom: 10px;
                margin-top: 20px;
            }
            
            .content h1 {
                font-size: 18px;
            }
            
            .content h2 {
                font-size: 16px;
            }
            
            .content h3 {
                font-size: 14px;
            }
            
            .signature {
                margin-top: 40px;
                text-align: right;
            }
            
            .signature-line {
                margin-top: 60px;
                border-top: 1px solid #ccc;
                width: 200px;
                margin-left: auto;
                padding-top: 10px;
                text-align: center;
                font-size: 12px;
                color: #666;
            }
            
            .footer {
                position: absolute;
                bottom: 20px;
                left: 40px;
                right: 40px;
                text-align: center;
                font-size: 10px;
                color: #999;
                border-top: 1px solid #eee;
                padding-top: 10px;
            }
            
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                
                .container {
                    padding: 20px;
                }
                
                .footer {
                    position: fixed;
                    bottom: 0;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="name">Antoine Kingue</div>
                <div class="title">${language === 'french' ? 'Développeur R&D • Designer • Créateur de contenu' : 'R&D Developer • Designer • Content Creator'}</div>
                <div class="contact-info">
                    <div class="contact-item">
                        <span>📧</span>
                        <span>contact@antoinek.fr</span>
                    </div>
                    <div class="contact-item">
                        <span>📞</span>
                        <span>+33 6 99 72 53 58</span>
                    </div>
                    <div class="contact-item">
                        <span>🌐</span>
                        <span>antoinek.fr</span>
                    </div>
                    <div class="contact-item">
                        <span>💼</span>
                        <span>linkedin.com/in/antoinekm</span>
                    </div>
                </div>
            </div>
            
            <div class="date-location">
                <div>${language === 'french' ? 'Rouen, le' : 'Rouen,'} ${today}</div>
                <div style="margin-top: 5px;"><strong>${language === 'french' ? 'À l\'attention de' : 'To'} ${companyName}</strong></div>
            </div>
            
            <div class="content">
                ${coverLetter.replace(/\n/g, '</p><p>').replace(/^<\/p>/, '').replace(/<p>$/, '')}
            </div>
            
            <div class="signature">
                <div style="margin-bottom: 10px;">${language === 'french' ? 'Cordialement,' : 'Sincerely,'}</div>
                <div class="signature-line">Antoine Kingue</div>
            </div>
            
            <div class="footer">
                ${language === 'french' ? 'Lettre de motivation générée le' : 'Cover letter generated on'} ${today} • antoinek.fr
            </div>
        </div>
        
        <script>
            // Auto-print when the page loads (for PDF generation)
            window.onload = function() {
                setTimeout(function() {
                    window.print();
                }, 1000);
            }
        </script>
    </body>
    </html>
  `;
}