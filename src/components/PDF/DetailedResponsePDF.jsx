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
const padding = 32;
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: padding,
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  heading: {
    fontSize: "20px",
    fontFamily: "Helvetica-Bold",
    marginBottom: "12px",
    marginBottom: "12px",
  },
  paragraph: {
    fontSize: "12px",
    font: "Helvetica",
    marginTop: "8px",
    marginBottom: "12px",
  },
  question: {
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: "1px",
    padding: "18px",
  },
  forward: {
    fontSize: "12px",
    fontFamily: "Helvetica-Bold",
  },
  question: {
    marginTop: 8,
    marginBottom: 8,
  },
  inlineTextContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "12px",
  },
  b: {
    fontFamily: "Helvetica-Bold",
  },
  time: {
    color: "#845fff",
  },
  m: {
    marginBottom: "8px",
    marginTop: "8px",
  },
});

function DetailedResponsePDF({ response, formData, formTitle }) {
  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <Text style={styles.heading}>
          Respondent - {response.respondent.name}
        </Text>
        <Text style={styles.time}>
          {moment.utc(response.submittedAt).local().format("MMMM d, yyyy")} -{" "}
          {moment.utc(response.submittedAt).local().format("hh:mm A")}
        </Text>

        {formData.map((section) =>
          (section.questions ?? []).map((question) => {
            if (question.type == "heading")
              return (
                <Text style={styles.heading} key={question.questionID}>
                  {question.question ? question.question : null}
                </Text>
              );

            if (question.type == "paragraph")
              return (
                <Text style={styles.paragraph} key={question.questionID}>
                  {question.question ? question.question : null}
                </Text>
              );

            if (question.question == "" || !question.question) return;

            const matchedAnswer = response.responseData.find(
              (item) => item.questionID === question.id
            );

            return (
              <View style={styles.question}>
                <Text style={[styles.b, styles.m]}>Question: </Text>
                <Text style={styles.m}>{question.question}</Text>

                <Text style={[styles.b, styles.m]}>Answer: </Text>
                <AnswerRendererPDF answer={matchedAnswer?.answer} />
              </View>
            );
          })
        )}
      </Page>
    </Document>
  );
}

function MultipleDetailedResponsesPDF({ responses, formData }) {
  return (
    <Document>
      <Page>
        <Text>FUCKKK</Text>
      </Page>
    </Document>
  );
}

export default DetailedResponsePDF;
