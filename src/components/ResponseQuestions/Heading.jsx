function Heading({ question }) {
  return (
    <div className="flex px-4  justify-between items-start ">
      <p className="w-full font-vagrounded font-bold text-xl bg-transparent text-white font-vagrounded wrap-break-word">

        {question.question || 'Please input Heading'}
      </p>
    </div>
  );
}

export default Heading;
