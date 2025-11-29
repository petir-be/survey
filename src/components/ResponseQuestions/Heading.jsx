function Heading({ question }) {
  return (
    <div className="my-6">
      <p className="text-3xl mb-3 font-bold font-vagrounded wrap-break-word">
        {question.question}
      </p>
    </div>
  );
}

export default Heading;
