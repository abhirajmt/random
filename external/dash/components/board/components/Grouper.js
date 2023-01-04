import { useState } from "react";
import WidgetWrapper from "./WidgetWrapper";
import GrouperHeader from "./GrouperHeader";
import Separator from "./Separator";
import styles from '../fake/dashboard.module.css';

const defaultConfig = {
  collapsable: false,
  showSeparator: false,
  defaultClosed: false,
};

export const Grouper = ({
  name,
  config: _config = {},
  description,
  widgetLayouts,
  onWidgetHidden,
  ...restProps
}) => {
  const config = { ...defaultConfig, ..._config };
  const [hiddenWidgetCount, updateHiddenWidgetCount] = useState(0);

  const onWidgetHide = event => {
    onWidgetHidden(event);
    // updateHiddenWidgetCount(hiddenWidgetCount += 1);
  };

  return (
    <div
      style={{ transform: "translateZ(0)" }}
      className={hiddenWidgetCount === widgetLayouts.length ? `${styles.hidden} grouper-style ${styles['md:shadow']} ${styles['md:mb-12']} ${styles['md:rounded']}` : `grouper-style ${styles['md:shadow']} ${styles['md:mb-12']} ${styles['md:rounded']}`}
    >
      <GrouperHeader name={name} description={description} />
      <div className={`${styles['md:rounded']} ${styles.grid} ${styles['grid-cols-18']} ${styles['bg-white']}`}>
        {/* note: widget_hidden is written twice here because we want to forward it as well as listen to it */}
        {widgetLayouts.map((widgetLayout, index) => (
          <>
            <WidgetWrapper
              {...widgetLayout}
              {...restProps}
              onWidgetHidden={onWidgetHide}
            />
            {config.showSeparator &&
              index < widgetLayouts.length - 1 &&
              widgetLayout.colspan === 4 && <Separator />}
          </>
        ))}
      </div>
    </div>
  );
};

export default Grouper;
