import { useRef } from "react";
import Draggable from "react-draggable";

const Card = ({ title, key }) => {
  const nodeRef = useRef(null);
  return (
    <Draggable nodeRef={nodeRef}>
      <div className="card" ref={nodeRef}>
        <div className="header">{title}</div>
        <div className="content">Content</div>
      </div>
    </Draggable>
  );
};
export default Card;
