function Paragraph({ question }) {
  return (
    <div className="flex px-8  justify-between items-start">
      <p className="w-full font-vagrounded font-normal  text-xl bg-transparent text-white font-vagrounded wrap-break-word">

        {question.question}
      </p>
    </div>
  );
}

export default Paragraph;
