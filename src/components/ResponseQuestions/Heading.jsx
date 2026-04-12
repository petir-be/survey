function Heading({ question }) {
  return (
    <div className="flex px-8  justify-between items-start ">
      <p className="w-full font-vagrounded font-bold text-xl bg-transparent text-white font-vagrounded wrap-break-word">

        {question.question}
      </p>
    </div>
  );
}

export default Heading;
