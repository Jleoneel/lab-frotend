import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

import utmLogo from "../../assets/logos/utm.png";
import cabaLogo from "../../assets/logos/caba.png";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    paddingTop: 25,
    paddingBottom: 40,
    paddingHorizontal: 40,
    color: "#000",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  logoLeft: {
    width: 140,
    height: 55,
    objectFit: "contain",
  },

  logoRight: {
    width: 140,
    height: 55,
    objectFit: "contain",
  },

  title: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginVertical: 6,
  },

  infoTable: {
    borderWidth: 1,
    borderColor: "#000",
  },

  infoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  infoRowLast: {
    flexDirection: "row",
  },

  infoLabel: {
    width: 120,
    padding: 5,
    fontFamily: "Helvetica-Bold",
    borderRightWidth: 1,
    borderRightColor: "#000",
    backgroundColor: "#f3f3f3",
  },

  infoValue: {
    width: 260,
    padding: 5,
  },

  infoRight: {
    width: 170,
    borderLeftWidth: 1,
    borderLeftColor: "#000",
    padding: 5,
  },

  infoRightLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
  },

  infoRightValue: {
    fontSize: 7,
  },

  qrSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },

  qrImage: {
    width: 70,
    height: 70,
  },

  responsableText: {
    fontSize: 7,
    marginTop: 4,
    textAlign: "center",
  },

  responsableSubText: {
    fontSize: 7,
    textAlign: "center",
  },

  colorBar: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 10,
  },

  greenBar: {
    flex: 3,
    height: 5,
    backgroundColor: "#1e7e34",
  },

  yellowBar: {
    flex: 1,
    height: 5,
    backgroundColor: "#f4c430",
  },

  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginTop: 10,
    marginBottom: 6,
  },

  resultsTable: {
    borderWidth: 1,
    borderColor: "#000",
  },

  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#e8e8e8",
  },

  tableRow: {
    flexDirection: "row",
  },

  colMuestra: {
    width: 80,
    padding: 5,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
    fontFamily: "Helvetica-Bold",
  },

  colWide: {
    flex: 1,
    textAlign: "center",
    padding: 5,
    fontFamily: "Helvetica-Bold",
  },

  colEmpty: {
    width: 80,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },

  colHeader: {
    flex: 1,
    textAlign: "center",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    fontFamily: "Helvetica-Bold",
  },

  colHeaderLast: {
    flex: 1,
    textAlign: "center",
    padding: 5,
    fontFamily: "Helvetica-Bold",
  },

  col: {
    flex: 1,
    textAlign: "center",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },

  colLast: {
    flex: 1,
    textAlign: "center",
    padding: 5,
  },

  metodoText: {
    fontSize: 8,
    marginTop: 3,
  },

  metodoLabel: {
    fontFamily: "Helvetica-Bold",
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    color: "#666",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 5,
  },

  tableRowBorder: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";

  return new Date(dateStr).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function SampleReportPDF({ sample, analyses, labInfo }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image style={styles.logoLeft} src={utmLogo} />
          <Image style={styles.logoRight} src={cabaLogo} />
        </View>

        {/* TITULO */}
        <Text style={styles.title}>INFORME DE RESULTADOS</Text>

        {/* TABLA INFO */}
        <View style={styles.infoTable}>
          {/* Usuario + fechas */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Usuario</Text>

            <Text style={styles.infoValue}>{sample.clientName}</Text>

            <View style={styles.infoRight}>
              <Text style={styles.infoRightLabel}>Fecha de recibido:</Text>
              <Text style={styles.infoRightValue}>
                {formatDate(sample.receivedAt)}
              </Text>

              <Text style={styles.infoRightLabel}>Fecha de análisis:</Text>
              <Text style={styles.infoRightValue}>
                {formatDate(sample.receivedAt)}
              </Text>

              <Text style={styles.infoRightLabel}>Fecha de reporte:</Text>
              <Text style={styles.infoRightValue}>
                {formatDate(new Date())}
              </Text>
            </View>
          </View>

          {/* Dirección + espacio firma */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dirección</Text>
            <Text style={styles.infoValue}>
              {sample.clientAddress || "N/A"}
            </Text>
            <View
              style={[
                styles.infoRight,
                { minHeight: 100, justifyContent: "flex-end", padding: 5 },
              ]}
            >
              <Text
                style={[
                  styles.responsableText,
                  { fontFamily: "Helvetica-Bold" },
                ]}
              >
                {labInfo?.responsible}
              </Text>
              <Text style={styles.responsableSubText}>Responsable de los</Text>
              <Text style={styles.responsableSubText}>
                Laboratorios CABA - LAB
              </Text>
              <Text style={styles.responsableSubText}>
                Autorizado y revisado
              </Text>
            </View>
          </View>

          {/* Teléfono */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono</Text>

            <Text style={styles.infoValue}>{sample.clientPhone || "N/A"}</Text>

            <View style={styles.infoRight} />
          </View>

          {/* Muestra */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Muestra</Text>

            <Text style={styles.infoValue}>{sample.sampleName || "N/A"}</Text>

            <View style={styles.infoRight} />
          </View>

          {/* Cantidad */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cantidad recibida</Text>

            <Text style={styles.infoValue}>
              {sample.cantidadRecibida || "N/A"}
            </Text>

            <View style={styles.infoRight} />
          </View>

          {/* Objetivo */}
          <View style={styles.infoRowLast}>
            <Text style={styles.infoLabel}>Objetivo del análisis</Text>

            <Text style={styles.infoValue}>
              {sample.objetivoAnalisis || "N/A"}
            </Text>

            <View style={styles.infoRight} />
          </View>
        </View>

        {/* BARRA COLOR */}
        <View style={styles.colorBar}>
          <View style={styles.greenBar} />
          <View style={styles.yellowBar} />
        </View>

        {/* RESULTADOS — agrupados por servicio */}
        {(() => {
          const grouped = analyses.reduce((acc, analysis) => {
            const key = analysis.serviceId;
            if (!acc[key]) acc[key] = [];
            acc[key].push(analysis);
            return acc;
          }, {});

          return Object.values(grouped).map((group) => {
            const serviceName = group[0].service?.name?.toUpperCase();
            const serviceCode = group[0].service?.code;

            return (
              <View key={group[0].serviceId} wrap={false}>
                <Text style={styles.sectionTitle}>{serviceName}</Text>

                <View style={styles.resultsTable}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.colHeader}>Muestra</Text>
                    <Text style={styles.colHeader}>Resultado</Text>
                    <Text style={styles.colHeader}>Unidad</Text>
                    <Text style={styles.colHeaderLast}>Estado</Text>
                  </View>

                  {group.map((analysis, index) => (
                    <View
                      key={analysis.id}
                      style={
                        index === group.length - 1
                          ? styles.tableRow
                          : styles.tableRowBorder
                      }
                    >
                      <Text style={styles.col}>{index + 1}</Text>
                      <Text style={styles.col}>
                        {analysis.result?.resultNumber ??
                          analysis.result?.resultText ??
                          "N/A"}
                      </Text>
                      <Text style={styles.col}>
                        {analysis.result?.unit || "-"}
                      </Text>
                      <Text style={styles.colLast}>
                        {analysis.result?.isFinal ? "Final" : "Preliminar"}
                      </Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.metodoText}>
                  <Text style={styles.metodoLabel}>Método de ensayo: </Text>
                  {serviceCode || "N/A"}
                </Text>
              </View>
            );
          });
        })()}

        {/* FOOTER */}
        <Text style={styles.footer}>
          {labInfo?.labName} — Informe generado el {formatDate(new Date())} —{" "}
          {sample.sampleCode}
        </Text>
      </Page>
    </Document>
  );
}
