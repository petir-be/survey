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
const PAGE_PADDING = 40;

const styles = StyleSheet.create({
  page: { padding: PAGE_PADDING },
  section: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 30,
  },
  // Wrap each chart+table to prevent splitting
  chartTableWrapper: {
    marginBottom: 30,
  },
  text: { fontSize: 12, marginBottom: 2, color: "#535353ff" },
  title: {
    fontSize: "22px",
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "left",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginTop: 15,
    marginBottom: 20,
  },
  tableRow: { 
    flexDirection: "row",
    minHeight: 32,
  },
  tableCol: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    borderRightStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderBottomStyle: "solid",
    padding: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableColLast: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderBottomStyle: "solid",
    padding: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableHeader: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#bfbfbf",
    borderRightStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    borderBottomStyle: "solid",
    padding: 8,
    backgroundColor: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableHeaderLast: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    borderBottomStyle: "solid",
    padding: 8,
    backgroundColor: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableCell: { 
    fontSize: 10, 
    textAlign: "center",
    color: "#333",
  },
  tableCellHeader: {
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    color: "#000",
  },
});

function SummaryPDF({ chartImages, formTitle, aggregated }) {
  const availableWidth = PAGE_WIDTH - 2 * PAGE_PADDING;
  
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{formTitle}</Text>
          <Text style={styles.text}>
            Total Responses collected: {Object.keys(aggregated).length}
          </Text>
          <Text style={styles.text}>
            This report was created at{" "}
            {moment().format("MMMM Do YYYY, h:mm:ss a")}
          </Text>
        </View>

        {chartImages.map(({ questionId, dataUrl }) => {
          const IMAGE_ORIGINAL_WIDTH = 200;
          const IMAGE_ORIGINAL_HEIGHT = 100;
          const scale = availableWidth / IMAGE_ORIGINAL_WIDTH;
          const imageWidth = IMAGE_ORIGINAL_WIDTH * scale;
          const imageHeight = IMAGE_ORIGINAL_HEIGHT * scale;

          let headers = [];
          let rows = [];
          let q = aggregated[questionId];

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
              <Image
                src={dataUrl}
                style={{ width: imageWidth, height: imageHeight }}
              />

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
      </Page>
    </Document>
  );
}

export default SummaryPDF;