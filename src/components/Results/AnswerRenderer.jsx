function AnswerRenderer({ answer }) {
  if (
    answer === null ||
    answer === undefined ||
    (Array.isArray(answer) && answer.length === 0)
  ) {
    return <span>No answer</span>;
  }

  // ✅ Checkbox / multi-select answers (array)
  if (Array.isArray(answer)) {
    return (
      <ul className="list-disc list-inside">
        {answer.map((item, index) => (
          <li key={index}>{item}</li>
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

export default AnswerRenderer;
