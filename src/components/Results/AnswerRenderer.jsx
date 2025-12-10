import { Text, View, StyleSheet } from "@react-pdf/renderer";
import FileAnswerDisplay from "./FileAnswerDisplay";
const styles = StyleSheet.create({
  empty: {
    fontStyle: "italic",
    color: "#777",
  },
  list: {
    marginLeft: 10,
  },
  listItem: {
    marginBottom: 2,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  bold: {
    fontWeight: "bold",
  },
});

export function AnswerRenderer({ answer }) {
  if (
    answer === null ||
    answer === undefined ||
    (Array.isArray(answer) && answer.length === 0)
  ) {
    return <span className="text-gray-400 italic">No answer</span>;
  }

  if (Array.isArray(answer)) {
    const firstItem = answer[0];
    if (
      firstItem &&
      typeof firstItem === "object" &&
      (firstItem.mediaUrl || firstItem.size || firstItem.fileType)
    ) {
      return <FileAnswerDisplay files={answer} />;
    }

    return (
      <ul className="list-disc list-inside">
        {answer.map((item, index) => (
          <li key={index}>
            {/* Added a tiny safety check here so it doesn't crash if an object slips through */}
            {typeof item === "object" ? JSON.stringify(item) : item}
          </li>
        ))}
      </ul>
    );
  }

  // ✅ Choice matrix (object map)
  if (typeof answer === "object") {
    return (
      <div className="flex flex-col gap-1">
        {Object.entries(answer).map(([row, column]) => (
          <div key={row}>
            <strong>{row}:</strong> {column}
          </div>
        ))}
      </div>
    );
  }

  // ✅ Primitive answers (string, number, boolean)
  return <span>{String(answer)}</span>;
}

export function AnswerRendererPDF({ answer }) {
  // ✅ No answer
  if (
    answer === null ||
    answer === undefined ||
    (Array.isArray(answer) && answer.length === 0)
  ) {
    return <Text style={styles.empty}>No answer</Text>;
  }

  // ✅ Checkbox / multi-select answers (array)
  if (Array.isArray(answer)) {
    return (
      <View style={styles.list}>
        {answer.map((item, index) => (
          <Text key={index} style={styles.listItem}>
            • {String(item)}
          </Text>
        ))}
      </View>
    );
  }

  // ✅ Choice matrix / object answers
  if (typeof answer === "object") {
    return (
      <View style={styles.column}>
        {Object.entries(answer).map(([row, column]) => (
          <Text key={row}>
            <Text style={styles.bold}>{row}:</Text> {String(column)}
          </Text>
        ))}
      </View>
    );
  }

  // ✅ Primitive answers (string, number, boolean)
  return <Text>{String(answer)}</Text>;
}
