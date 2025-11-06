import { useState } from "react";
import Card from "./Card";

const List = () => {
  const [cards, setCards] = useState([
    { title: "Foo", id: 0 },
    { title: "Bar", id: 1 },
    { title: "Foobar", id: 3 },
  ]);
  return (
    <div className="list">
      {cards.map((card) => (
        <Card title={card.title} key={card.id} />
      ))}
    </div>
  );
};

export default List;
