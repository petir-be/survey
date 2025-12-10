import {
  Document,
  Page,
  Text,
  Image,
  StyleSheet,
  View,
  Font,
} from "@react-pdf/renderer";
import moment from "moment";

const PAGE_WIDTH = 595;
const PAGE_PADDING = 50;

const styles = StyleSheet.create({
  page: { 
    padding: PAGE_PADDING,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2px solid #845fff",
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
  },
  subtitle: { 
    fontSize: 11, 
    marginBottom: 4, 
    color: "#64748b",
    lineHeight: 1.5,
  },
  chartTableWrapper: {
    marginBottom: 35,
    break: "avoid",
  },
  questionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  chartContainer: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableRow: { 
    flexDirection: "row",
    minHeight: 36,
  },
  tableCol: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#f1f5f9",
    borderRightStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    borderBottomStyle: "solid",
    padding: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableColLast: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    borderBottomStyle: "solid",
    padding: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableHeader: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#cbd5e1",
    borderRightStyle: "solid",
    borderBottomWidth: 2,
    borderBottomColor: "#cbd5e1",
    borderBottomStyle: "solid",
    padding: 10,
    backgroundColor: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableHeaderLast: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: "#cbd5e1",
    borderBottomStyle: "solid",
    padding: 10,
    backgroundColor: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableCell: { 
    fontSize: 10, 
    textAlign: "center",
    color: "#475569",
  },
  tableCellHeader: {
    fontSize: 11,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    color: "#334155",
    letterSpacing: 0.3,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: PAGE_PADDING,
    right: PAGE_PADDING,
    textAlign: "center",
    fontSize: 9,
    color: "#94a3b8",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 10,
  },
  statsBox: {
    backgroundColor: "#f5f0ff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeft: "3px solid #845fff",
  },
  statsText: {
    fontSize: 11,
    color: "#0f172a",
    fontFamily: "Helvetica-Bold",
  },
});

function SummaryPDF({ chartImages, formTitle, aggregated }) {
  const availableWidth = PAGE_WIDTH - 2 * PAGE_PADDING;
  const totalResponses = Object.keys(aggregated).length;
  
  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>{formTitle}</Text>
          <View style={styles.statsBox}>
            <Text style={styles.statsText}>
              Total Responses: {totalResponses}
            </Text>
          </View>
          <Text style={styles.subtitle}>
            Generated on {moment().format("MMMM Do YYYY")} at {moment().format("h:mm A")}
          </Text>
        </View>

        {/* Charts and Tables */}
        {chartImages.map(({ questionId, dataUrl }) => {
          const IMAGE_ORIGINAL_WIDTH = 200;
          const IMAGE_ORIGINAL_HEIGHT = 100;
          const scale = availableWidth / IMAGE_ORIGINAL_WIDTH;
          const imageWidth = IMAGE_ORIGINAL_WIDTH * scale;
          const imageHeight = IMAGE_ORIGINAL_HEIGHT * scale;

          let headers = [];
          let rows = [];
          let q = aggregated[questionId];
          let questionText = q.question || questionId;

          if (q.type === "choice_matrix") {
            headers = ["Row", ...Object.keys(Object.values(q.rows)[0])];
            rows = Object.entries(q.rows).map(([rowName, rowValues]) => {
              return [rowName, ...Object.values(rowValues)];
            });
          } else {
            headers = ["Option", "Responses"];
            rows = Object.entries(q.options).map(([option, count]) => [
              option,
              count,
            ]);
          }

          return (
            <View key={questionId} style={styles.chartTableWrapper} wrap={false}>
              
              {/* Chart */}
              <View style={styles.chartContainer}>
                <Image
                  src={dataUrl}
                  style={{ width: imageWidth, height: imageHeight }}
                />
              </View>

              {/* Table */}
              <View style={styles.table}>
                {/* Header */}
                <View style={styles.tableRow}>
                  {headers.map((header, i) => (
                    <View 
                      style={i === headers.length - 1 ? styles.tableHeaderLast : styles.tableHeader} 
                      key={i}
                    >
                      <Text style={styles.tableCellHeader}>{header}</Text>
                    </View>
                  ))}
                </View>
                {/* Rows */}
                {rows.map((row, i) => (
                  <View style={styles.tableRow} key={i}>
                    {row.map((cell, j) => (
                      <View 
                        style={j === row.length - 1 ? styles.tableColLast : styles.tableCol} 
                        key={j}
                      >
                        <Text style={styles.tableCell}>{cell}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {/* Footer */}
        <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) => (
          `${pageNumber}`
        )} />
      </Page>
    </Document>
  );
}

export default SummaryPDF;