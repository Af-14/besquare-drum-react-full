import "./main-container.css";

import React from "react";
import ScoreContainer from "../ScoreContainer";
import SequenceContainer from "../SequenceContainer";
import TargetContainer from "../TargetContainer";
import { observer } from "mobx-react-lite";
import { playSound } from "../../Helpers/sounds";
import { useStores } from "../../stores";

const generateTestBeat = () => {
  const test_keys = ["a", "s", "d", "f", "g"];
  const generated_array = [];
  for (let index = 0; index < 10; index++) {
    generated_array.push(...test_keys);
  }
  return generated_array;
};

const target_keys: string[] = generateTestBeat();

type RecordItem = {
  key: string;
  time: number;
};

const MainContainer = () => {
  const { app_store, main_store } = useStores();

  React.useEffect(() => {
    main_store.setCurrentIndex(0);
    main_store.setScore(0);
  }, [app_store.has_game_started]);

  React.useEffect(() => {
    if (app_store.is_recording) {
      main_store.setRecordArray([]);
      main_store.setStartTime(Date.now());
    }
  }, [app_store.is_recording]);

  React.useEffect(() => {
    if (app_store.is_playing_back) {
      const promises: Promise<void>[] = [];

      for (let i = 0; i < main_store.recordArray.length; i++) {
        const item = main_store.recordArray[i];
        promises.push(playRecordedItem(item));
      }

      Promise.all(promises).then(() => app_store.setIsPlayingBack(false));
    }
  }, [app_store.is_playing_back, main_store.recordArray]);

  const playRecordedItem = (record_item: RecordItem) => {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        main_store.setActiveKey(record_item.key);
        await playSound(record_item.key);
        main_store.setActiveKey(undefined);

        resolve();
      }, record_item.time);
    });
  };

  const onKeyPress = (pressed_key: string) => {
    main_store.setActiveKey(pressed_key);

    if (!app_store.has_game_started && !app_store.is_recording) return;

    if (app_store.is_recording) {
      main_store.setRecordArray([
        ...main_store.recordArray,
        { key: pressed_key, time: Date.now() - main_store.startTime },
      ]);
    } else {
      if (main_store.current_index + 1 <= target_keys.length) {
        if (pressed_key === target_keys[main_store.current_index]) {
          main_store.setScore(main_store.score + 1);
          main_store.setCurrentIndex(main_store.current_index + 1);
        } else {
          main_store.setScore(main_store.score - 1);
        }
      }

      if (main_store.current_index + 1 >= target_keys.length) {
        alert("Game is complete!");
      }
    }
  };

  return (
    <div className="main-container">
      <ScoreContainer />
      <SequenceContainer target_keys={target_keys} />
      <TargetContainer
        active_key={main_store.active_key}
        setActiveKey={main_store.setActiveKey}
        onKeyPress={onKeyPress}
      />
    </div>
  );
};

export default observer(MainContainer);
