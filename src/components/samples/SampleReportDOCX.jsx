import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  VerticalAlign,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";

const BORDER = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NO_BORDERS = {
  top: NO_BORDER,
  bottom: NO_BORDER,
  left: NO_BORDER,
  right: NO_BORDER,
};

const cell = (children, opts = {}) =>
  new TableCell({
    borders: BORDERS,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    verticalAlign: VerticalAlign.CENTER,
    ...opts,
    children: Array.isArray(children)
      ? children
      : [
          new Paragraph({
            alignment: opts.align || AlignmentType.LEFT,
            children: Array.isArray(children)
              ? children
              : [new TextRun({ text: String(children ?? ""), ...opts.run })],
          }),
        ],
  });

const headerCell = (text, opts = {}) =>
  cell(text, {
    shading: { fill: "E8E8E8", type: ShadingType.CLEAR },
    run: { bold: true, size: 16 },
    ...opts,
  });

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "N/A";

export async function generateSampleDocx({
  sample,
  analyses,
  labInfo,
  utmLogoUrl,
  cabaLogoUrl,
}) {
  // Cargar logos como base64
  const fetchImage = async (url) => {
    try {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      return new Uint8Array(buf);
    } catch {
      return null;
    }
  };

  const utmImg = utmLogoUrl ? await fetchImage(utmLogoUrl) : null;
  const cabaImg = cabaLogoUrl ? await fetchImage(cabaLogoUrl) : null;

  // Agrupar análisis por servicio
  const grouped = analyses.reduce((acc, a) => {
    const key = a.serviceId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  // Tabla de header con logos
  const headerTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2500, 4360, 2500],
    borders: {
      ...Object.fromEntries(Object.keys(BORDERS).map((k) => [k, NO_BORDER])),
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: NO_BORDERS,
            width: { size: 2500, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: utmImg
                  ? [
                      new ImageRun({
                        data: utmImg,
                        type: "png",
                        transformation: { width: 120, height: 50 },
                      }),
                    ]
                  : [new TextRun({ text: "UTM", bold: true, size: 24 })],
              }),
            ],
          }),
          new TableCell({
            borders: NO_BORDERS,
            width: { size: 4360, type: WidthType.DXA },
            children: [new Paragraph({ children: [] })],
          }),
          new TableCell({
            borders: NO_BORDERS,
            width: { size: 2500, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: cabaImg
                  ? [
                      new ImageRun({
                        data: cabaImg,
                        type: "png",
                        transformation: { width: 120, height: 50 },
                      }),
                    ]
                  : [new TextRun({ text: "CABA", bold: true, size: 24 })],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Título
  const titulo = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
    children: [
      new TextRun({ text: "INFORME DE RESULTADOS", bold: true, size: 28 }),
    ],
  });

  // Tabla de información del cliente
  const infoTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1800, 4060, 3500],
    rows: [
      // Fila Usuario + fechas
      new TableRow({
        children: [
          headerCell("Usuario", { width: { size: 1800, type: WidthType.DXA } }),
          cell(sample.clientName || "N/A", {
            width: { size: 4060, type: WidthType.DXA },
          }),
          new TableCell({
            borders: BORDERS,
            width: { size: 3500, type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Fecha de recibido: ${formatDate(sample.receivedAt)}`,
                    size: 16,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Fecha de análisis: ${formatDate(sample.receivedAt)}`,
                    size: 16,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Fecha de reporte: ${formatDate(new Date())}`,
                    size: 16,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      // Dirección + firma
      new TableRow({
        children: [
          headerCell("Dirección", {
            width: { size: 1800, type: WidthType.DXA },
          }),
          cell(sample.clientAddress || "N/A", {
            width: { size: 4060, type: WidthType.DXA },
          }),
          new TableCell({
            borders: BORDERS,
            width: { size: 3500, type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({ children: [] }),
              new Paragraph({ children: [] }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: labInfo?.responsible || "",
                    bold: true,
                    size: 16,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Responsable de los", size: 16 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Laboratorios CABA - LAB", size: 16 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Autorizado y revisado", size: 16 }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          headerCell("Teléfono", {
            width: { size: 1800, type: WidthType.DXA },
          }),
          cell(sample.clientPhone || "N/A", {
            width: { size: 4060, type: WidthType.DXA },
          }),
          cell("", { width: { size: 3500, type: WidthType.DXA } }),
        ],
      }),
      new TableRow({
        children: [
          headerCell("Muestra", { width: { size: 1800, type: WidthType.DXA } }),
          cell(sample.sampleName || "N/A", {
            width: { size: 4060, type: WidthType.DXA },
          }),
          cell("", { width: { size: 3500, type: WidthType.DXA } }),
        ],
      }),
      new TableRow({
        children: [
          headerCell("Cantidad recibida", {
            width: { size: 1800, type: WidthType.DXA },
          }),
          cell(sample.cantidadRecibida || "N/A", {
            width: { size: 4060, type: WidthType.DXA },
          }),
          cell("", { width: { size: 3500, type: WidthType.DXA } }),
        ],
      }),
      new TableRow({
        children: [
          headerCell("Objetivo del análisis", {
            width: { size: 1800, type: WidthType.DXA },
          }),
          cell(sample.objetivoAnalisis || "N/A", {
            width: { size: 4060, type: WidthType.DXA },
          }),
          cell("", { width: { size: 3500, type: WidthType.DXA } }),
        ],
      }),
    ],
  });

  // Barra de color UTM
  const colorBar = new Paragraph({
    spacing: { before: 160, after: 160 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 18,
        color: "1e7e34",
        space: 2,
      },
    },
    children: [],
  });

  // Secciones de resultados por servicio
  const resultSections = [];

  // Reemplaza el bloque "for (const group of Object.values(grouped))" por esto:

  for (const group of Object.values(grouped)) {
    const serviceName = group[0].service?.name?.toUpperCase() || "";
    const serviceCode = group[0].service?.code || "N/A";

    resultSections.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: serviceName, bold: true, size: 22 })],
      }),
    );

    const colWidths = [2340, 2340, 2340, 2340];

    const resultsTable = new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: colWidths,
      rows: [
        // Header
        new TableRow({
          children: [
            headerCell("Muestra", {
              width: { size: 2340, type: WidthType.DXA },
              align: AlignmentType.CENTER,
            }),
            headerCell("Resultado", {
              width: { size: 2340, type: WidthType.DXA },
              align: AlignmentType.CENTER,
            }),
            headerCell("Unidad", {
              width: { size: 2340, type: WidthType.DXA },
              align: AlignmentType.CENTER,
            }),
            headerCell("Estado", {
              width: { size: 2340, type: WidthType.DXA },
              align: AlignmentType.CENTER,
            }),
          ],
        }),
        // Filas de datos
        ...group.map(
          (a, idx) =>
            new TableRow({
              children: [
                cell(String(idx + 1), {
                  width: { size: 2340, type: WidthType.DXA },
                  align: AlignmentType.CENTER,
                }),
                cell(
                  String(
                    a.result?.resultNumber ?? a.result?.resultText ?? "N/A",
                  ),
                  {
                    width: { size: 2340, type: WidthType.DXA },
                    align: AlignmentType.CENTER,
                  },
                ),
                cell(a.result?.unit || "-", {
                  width: { size: 2340, type: WidthType.DXA },
                  align: AlignmentType.CENTER,
                }),
                cell(a.result?.isFinal ? "Final" : "Preliminar", {
                  width: { size: 2340, type: WidthType.DXA },
                  align: AlignmentType.CENTER,
                }),
              ],
            }),
        ),
      ],
    });

    resultSections.push(resultsTable);
    resultSections.push(
      new Paragraph({
        spacing: { before: 80, after: 160 },
        children: [
          new TextRun({ text: "Método de ensayo: ", bold: true, size: 18 }),
          new TextRun({ text: serviceCode, size: 18 }),
        ],
      }),
    );
  }

  // Footer
  const footer = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 },
    border: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 },
    },
    children: [
      new TextRun({
        text: `${labInfo?.labName || "CABA UTM"} — Informe generado el ${formatDate(new Date())} — ${sample.sampleCode}`,
        size: 14,
        color: "666666",
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: [
          headerTable,
          titulo,
          infoTable,
          colorBar,
          ...resultSections,
          footer,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `informe-${sample.sampleCode}.docx`);
}
