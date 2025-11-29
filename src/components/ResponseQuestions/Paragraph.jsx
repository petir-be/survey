function Paragraph({ question }) {
  return (
    <div className="my-6">
      <p className="text-2xl mb-3 font-vagrounded wrap-break-word">
        {question.question}
      </p>
    </div>
  );
}

export default Paragraph;
