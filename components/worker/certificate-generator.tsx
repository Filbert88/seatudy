// CertificateGenerator.tsx
import React from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { useSession } from 'next-auth/react';

interface CertificateGeneratorProps {
  courseName: string;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({courseName}: CertificateGeneratorProps) => {
  const session = useSession();
  const generateCertificate = async () => {
    // Create a new PDF document
    const templateUrl = './assets/certificate.pdf'; // Replace with your template PDF path or URL
    const templateBytes = await fetch(templateUrl).then(res => res.arrayBuffer());

    // Load the existing PDF template
    const pdfDoc = await PDFDocument.load(templateBytes);

    const pages = pdfDoc.getPages();
    const page = pages[0];

    const normalize = (value: number) => value / 255;

    page.drawText(session?.data?.user.name ?? '', {
      x: 320,
      y: 265,
      size: 25,
      color: rgb(normalize(255), normalize(255), normalize(255)), 
    });


    page.drawText(courseName, {
      x: 306,
      y: 170,
      size: 25,
      color: rgb(normalize(255), normalize(255), normalize(255)), 
    });


    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();

    // Create a blob and trigger a download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'certificate.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button onClick={generateCertificate} className="font-nunito bg-transparent w-fit h-fit hover:underline text-blue-600">here</button>
    </div>
  );
};

export default CertificateGenerator;
