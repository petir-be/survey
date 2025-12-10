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
import { AnswerRendererPDF } from "../Results/AnswerRenderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 40,
    fontSize: "10px",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: "2px solid #845fff",
  },
  respondentName: {
    fontSize: "18px",
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  timestamp: {
    fontSize: "10px",
    color: "#845fff",
    fontFamily: "Helvetica",
  },
  columnsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
  },
  column: {
    flex: 1,
    width: "48%",
  },
  questionBlock: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
    borderLeft: "3px solid #845fff",
  },
  sectionHeading: {
    fontSize: "14px",
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginTop: 16,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: "1px solid #e0e0e0",
  },
  sectionParagraph: {
    fontSize: "10px",
    color: "#555555",
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 1.4,
  },
  questionLabel: {
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
    color: "#666666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: "10px",
    color: "#1a1a1a",
    marginBottom: 8,
    lineHeight: 1.4,
  },
  answerLabel: {
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
    color: "#666666",
    marginBottom: 4,
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  answerText: {
    fontSize: "10px",
    color: "#2c2c2c",
    lineHeight: 1.4,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#999999",
  },
});

export function DetailedResponsePDF({ response, formData, formTitle }) {
  // Separate questions into two columns
  const allQuestions = formData.flatMap((section) =>
    (section.questions ?? []).map((question) => ({
      ...question,
      section: section,
    }))
  );

  const validQuestions = allQuestions.filter(
    (q) =>
      q.question &&
      q.question !== "" &&
      q.type !== "heading" &&
      q.type !== "paragraph"
  );

  const midpoint = Math.ceil(validQuestions.length / 2);
  const leftColumn = validQuestions.slice(0, midpoint);
  const rightColumn = validQuestions.slice(midpoint);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.respondentName}>
            {response.respondent?.name || "Anonymous"}
          </Text>
          <Text style={styles.timestamp}>
            {moment.utc(response.submittedAt).local().format("MMMM D, YYYY")} at{" "}
            {moment.utc(response.submittedAt).local().format("h:mm A")}
          </Text>
        </View>

        {/* Two Column Layout */}
        <View style={styles.columnsContainer}>
          {/* Left Column */}
          <View style={styles.column}>
            {leftColumn.map((question) => {
              const matchedAnswer = response.responseData.find(
                (item) => item.questionID === question.id
              );

              return (
                <View style={styles.questionBlock} key={question.id}>
                  <Text style={styles.questionLabel}>Question</Text>
                  <Text style={styles.questionText}>{question.question}</Text>

                  <Text style={styles.answerLabel}>Answer</Text>
                  <AnswerRendererPDF answer={matchedAnswer?.answer} />
                </View>
              );
            })}
          </View>

          {/* Right Column */}
          <View style={styles.column}>
            {rightColumn.map((question) => {
              const matchedAnswer = response.responseData.find(
                (item) => item.questionID === question.id
              );

              return (
                <View style={styles.questionBlock} key={question.id}>
                  <Text style={styles.questionLabel}>Question</Text>
                  <Text style={styles.questionText}>{question.question}</Text>

                  <Text style={styles.answerLabel}>Answer</Text>
                  <AnswerRendererPDF answer={matchedAnswer?.answer} />
                </View>
              );
            })}
          </View>
        </View>

        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber}`}
          fixed
        />
      </Page>
    </Document>
  );
}

export function MultipleDetailedResponsesPDF({
  responses,
  formData,
  formTitle,
}) {
  return (
    <Document>
      {responses.map((response, index) => {
        // Separate questions into two columns
        const allQuestions = formData.flatMap((section) =>
          (section.questions ?? []).map((question) => ({
            ...question,
            section: section,
          }))
        );

        const validQuestions = allQuestions.filter(
          (q) =>
            q.question &&
            q.question !== "" &&
            q.type !== "heading" &&
            q.type !== "paragraph"
        );

        const midpoint = Math.ceil(validQuestions.length / 2);
        const leftColumn = validQuestions.slice(0, midpoint);
        const rightColumn = validQuestions.slice(midpoint);

        return (
          <Page size="A4" style={styles.page} key={index}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.respondentName}>
                {response.respondent.name}
              </Text>
              <Text style={styles.timestamp}>
                {moment
                  .utc(response.submittedAt)
                  .local()
                  .format("MMMM D, YYYY")}{" "}
                at {moment.utc(response.submittedAt).local().format("h:mm A")}
              </Text>
            </View>

            {/* Two Column Layout */}
            <View style={styles.columnsContainer}>
              {/* Left Column */}
              <View style={styles.column}>
                {leftColumn.map((question) => {
                  const matchedAnswer = response.responseData.find(
                    (item) => item.questionID === question.id
                  );

                  return (
                    <View style={styles.questionBlock} key={question.id}>
                      <Text style={styles.questionLabel}>Question</Text>
                      <Text style={styles.questionText}>
                        {question.question}
                      </Text>

                      <Text style={styles.answerLabel}>Answer</Text>
                      <AnswerRendererPDF answer={matchedAnswer?.answer} />
                    </View>
                  );
                })}
              </View>

              {/* Right Column */}
              <View style={styles.column}>
                {rightColumn.map((question) => {
                  const matchedAnswer = response.responseData.find(
                    (item) => item.questionID === question.id
                  );

                  return (
                    <View style={styles.questionBlock} key={question.id}>
                      <Text style={styles.questionLabel}>Question</Text>
                      <Text style={styles.questionText}>
                        {question.question}
                      </Text>

                      <Text style={styles.answerLabel}>Answer</Text>
                      <AnswerRendererPDF answer={matchedAnswer?.answer} />
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Page Number */}
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
              fixed
            />
          </Page>
        );
      })}
    </Document>
  );
}
