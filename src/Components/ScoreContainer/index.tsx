import "./score.css";

import { observer } from "mobx-react-lite";
import { useStores } from "../../stores";

const ScoreContainer = () => {
  const { main_store } = useStores();

  return (
    <div className="score container">
      <div className="card score-card">
        <div className="score-header">Score</div>
        <div id="score">{main_store.score}</div>
      </div>
    </div>
  );
};

export default observer(ScoreContainer);
