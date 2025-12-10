import { Document, Page, Text, Image, StyleSheet, View } from "@react-pdf/renderer";

const PAGE_WIDTH = 595;
const PAGE_PADDING = 40;

const styles = StyleSheet.create({
  page: { padding: PAGE_PADDING },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  text: { fontSize: 12, marginBottom: 5 },
});

function SummaryPDF({ chartImages }) {
  const availableWidth = PAGE_WIDTH - 2 * PAGE_PADDING;

  return (
    <Document>
      <Page style={styles.page}>
        <View>
            <Text>
                FUck
            </Text>
        </View>
        {chartImages.map(({ questionId, dataUrl }) => {
          // If you know your chart original size, scale proportionally
          const IMAGE_ORIGINAL_WIDTH = 200;
          const IMAGE_ORIGINAL_HEIGHT = 100;
          const scale = availableWidth / IMAGE_ORIGINAL_WIDTH;
          const imageWidth = IMAGE_ORIGINAL_WIDTH * scale;
          const imageHeight = IMAGE_ORIGINAL_HEIGHT * scale;

          return (
            <View key={questionId} style={styles.section}>
              <Text style={styles.text}>{questionId}</Text>
              <Image
                src={dataUrl}
                style={{ width: imageWidth, height: imageHeight }}
              />
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

export default SummaryPDF;
