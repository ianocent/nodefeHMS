import React from "react";
import { createRoot, Root } from "react-dom/client";
import ReportTemplate from "../templates";


interface GeneratePDFParams {
  name: string;
  date?: string;
  startDate: string;
  endDate: string;
  reportData: any;
  filename?: string;
  isDownload?: boolean;
}

export const generatePDFFromHTML = async ({
  name,
  date,
  startDate,
  endDate,
  reportData,
  filename = "report",
  isDownload = false,
}: GeneratePDFParams): Promise<void> => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  let printWindow: Window | null = null;
  try {
    // Konversi reportData menjadi array jika berupa object
    // let dataArray: any[] = [];
    // if (Array.isArray(reportData)) {
    //   dataArray = reportData;
    // } else if (reportData && typeof reportData === "object") {
    //   // Jika object, konversi ke array menggunakan Object.values
    //   dataArray = Object.values(reportData);
    // }
    
    // Render component React ke DOM untuk print
    container = document.createElement("div");
    container.id = "pdf-container";
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "297mm"; // A4 landscape width
    container.style.minHeight = "210mm"; // A4 landscape height
    container.style.padding = "15mm 20mm"; // margin sesuai settingan: top/bottom 20mm, left/right 15mm
    container.style.backgroundColor = "#ffffff";
    container.style.boxSizing = "border-box";
    document.body.appendChild(container);

    root = createRoot(container);
    root.render(
      React.createElement(ReportTemplate, {
        name,
        date,
        startDate,
        endDate,
        reportData:{reportData},
      })
    );

    // TUNGGU SAMPAI BENAR-BENAR ADA ISI TABEL
    await new Promise<void>((resolve) => {
      let attempts = 0;
      const maxAttempts = 100; // maksimal 10 detik (100 x 100ms)

      const check = () => {
        attempts++;
        
        // Cek apakah sudah ada baris transaksi atau minimal header grup
        const hasGroups = container.querySelector("h2"); // ada <h2>ROOM REVENUE</h2> ?
        const hasRows = container.querySelector("table tbody tr");
        const hasContent = container.querySelector("#tax-breakdown-report-pdf main");

        if (hasGroups || hasRows || hasContent) {
          console.log(`Report rendered successfully after ${attempts} attempts`);
          setTimeout(resolve, 500); // beri waktu ekstra
        } else if (attempts >= maxAttempts) {
          console.warn("Timeout: Report content not rendered");
          resolve(); // paksa lanjut
        } else {
          setTimeout(check, 100);
        }
      };

      check();
    });

    // Sekarang ambil element
    let element = container.querySelector("#tax-breakdown-report-pdf") as HTMLElement;

    if (!element) {
      element = container.firstElementChild as HTMLElement;
    }

    if (!element || element.innerHTML.trim().length < 100) {
      throw new Error("Report still empty after waiting");
    }

    console.log("Final captured rows:", element.querySelectorAll("table tbody tr").length);

    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Jika isDownload = true, auto download PDF menggunakan printWindow
    if (isDownload) {
      await generatePDFDownload(clonedElement, filename);
      return;
    }

    // Jika isDownload = false, gunakan print dialog (text selectable)
    // Buat print window dengan HTML content untuk generate PDF dengan text selectable
    printWindow = window.open("", "_blank");
    if (!printWindow) {
      throw new Error("Popup blocked! Please allow pop-ups for this site.");
    }
    
    // Buat HTML document untuk print dengan settingan landscape dan margin
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${filename}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 20mm 15mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            text-transform: uppercase;
            margin: 0;
            padding: 0;
            background: white;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
          tr {
            page-break-inside: auto;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2 !important;
          }
          header {
            margin-bottom: 20px;
          }
          header h2 {
            margin: 0;
            font-size: 14px;
            font-weight: bold;
          }
          footer {
            margin-top: 20px;
            text-align: right;
          }
          footer p {
            margin: 0;
          }
          main {
            margin-top: 10px;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        ${clonedElement.innerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 250);
          };
          
          // Close window setelah print dialog ditutup
          window.addEventListener('afterprint', function() {
            window.close();
          });
          
          // Fallback: close window jika user cancel print (untuk browser yang tidak support afterprint)
          window.addEventListener('beforeunload', function() {
            // Window akan tertutup otomatis
          });
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Tambahkan event listener untuk menutup window setelah print
    printWindow.addEventListener('afterprint', () => {
      setTimeout(() => {
        if (printWindow && !printWindow.closed) {
          printWindow.close();
        }
      }, 100);
    });

    // Fallback: monitor jika window sudah ditutup
    const checkWindowClosed = setInterval(() => {
      if (printWindow && printWindow.closed) {
        clearInterval(checkWindowClosed);
      }
    }, 500);

    // Cleanup interval setelah 30 detik (jika window tidak tertutup)
    setTimeout(() => {
      clearInterval(checkWindowClosed);
      if (printWindow && !printWindow.closed) {
        printWindow.close();
      }
    }, 30000);

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    // Cleanup dengan delay untuk memastikan semua proses selesai
    setTimeout(() => {
      try {
        if (root && container) {
          root.unmount();
        }
      } catch (e) {
        console.warn("Error unmounting root:", e);
      }
      
      try {
        if (container && container.parentNode) {
          document.body.removeChild(container);
        }
      } catch (e) {
        console.warn("Error removing container:", e);
      }
    }, 3000);
  }
};

// Function untuk auto download PDF menggunakan jsPDF (tanpa print dialog)
const generatePDFDownload = async (
  clonedElement: HTMLElement,
  filename: string
): Promise<void> => {
  let tempContainer: HTMLDivElement | null = null;

  try {
    // Dynamic import jsPDF dan html2canvas
    // @ts-ignore - Dynamic import untuk client-side only
    const jsPDFModule = await import("jspdf");
    // @ts-ignore - Dynamic import untuk client-side only
    const html2canvasModule = await import("html2canvas");
    const jsPDF = jsPDFModule.default;
    const html2canvas = html2canvasModule.default;

    // Buat temporary container untuk element yang akan di-capture
    tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "0";
    tempContainer.style.top = "0";
    tempContainer.style.width = "297mm";
    tempContainer.style.backgroundColor = "#ffffff";
    tempContainer.style.visibility = "visible";
    tempContainer.style.display = "block";
    tempContainer.style.zIndex = "9999";
    tempContainer.style.opacity = "0";
    document.body.appendChild(tempContainer);

    // Append cloned element ke temp container
    tempContainer.appendChild(clonedElement);

    // Force reflow
    tempContainer.offsetHeight;
    clonedElement.offsetHeight;

    // Tunggu sebentar untuk memastikan rendering
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Convert HTML ke canvas dengan konfigurasi yang lebih baik
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Higher scale untuk kualitas lebih baik
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: clonedElement.scrollWidth || 1200,
      height: clonedElement.scrollHeight || 800,
      windowWidth: clonedElement.scrollWidth || 1200,
      windowHeight: clonedElement.scrollHeight || 800,
      allowTaint: false,
      removeContainer: false,
    });

    // Buat PDF dengan landscape orientation
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Set properties
    pdf.setProperties({ title: filename });

    // Calculate dimensions
    const imgWidth = 267; // A4 landscape width - margins (297mm - 15mm - 15mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = 210; // A4 landscape height

    // Convert canvas to image
    const imgData = canvas.toDataURL("image/png", 1.0);

    // Add image to PDF
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 15, 20, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 15, position + 20, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Auto download PDF
    pdf.save(`${filename}.pdf`);

  } catch (error) {
    console.error("Error generating PDF download:", error);
    throw error;
  } finally {
    // Cleanup temp container jika masih ada
    if (tempContainer && tempContainer.parentNode) {
      try {
        document.body.removeChild(tempContainer);
      } catch (e) {
        // Ignore error jika sudah di-remove
        console.warn("Temp container already removed");
      }
    }
  }
};

// Helper function untuk escape HTML
const escapeHtml = (text: string): string => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};


