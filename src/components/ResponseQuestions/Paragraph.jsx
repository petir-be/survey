function Paragraph({ question }) {
  return (
    <div className="flex px-4 justify-between items-start">
      <p className="w-full font-vagrounded font-normal  text-xl bg-transparent text-white font-vagrounded wrap-break-word">

        {question.question || 'Please input a paragraph here'}
      </p>
    </div>
  );
}

export default Paragraph;
