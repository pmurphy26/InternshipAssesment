import "./BoardHeader.css";

export function BoardHeader({
  createNewEvent,
}: {
  createNewEvent: () => void;
}) {
  return (
    <div className="board-page-header">
      <div
        className="board-left"
        style={{ width: "70%", height: "100%", padding: "0px 20px" }}
      >
        <div className="create-btn" onClick={createNewEvent}>
          <span className="plus">+</span>
          Create
        </div>
      </div>
      {/* Add sort by here if time allows */}
    </div>
  );
}
