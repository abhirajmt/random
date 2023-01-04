import React, { useEffect, useRef } from "react";
// import WidgetEngine from "../../widget";
import { getLaneClassesByColspan } from "../helpers/style";

// const widgetEngine = WidgetEngine.getInstance();

class WidgetEngine {}

WidgetEngine.prototype.render = () => console.log('kripa yahaan atki h');
import styles from '../fake/dashboard.module.css';

const widgetEngine = new WidgetEngine();

export const WidgetWrapper = ({
  appName,
  widget,
  targetId,
  locale,
  defaultLocaleUrl,
  tracker,
  lazyLoadConfig,
  rank,
  externals,
  useConfigParser,
  isPreviewing,
  previewOptions,
  runtimeEnvironment,
  colspan,
  scrollContainer,
  callbacks,
  onWidgetHidden,
  ...restProps
}) => {
  const targetRef = useRef();
  const colspanClass = getLaneClassesByColspan(colspan);

  const getWidgetPosition = _widget => {
    let modifiedWidget = { ..._widget };
    let xPosition = 0;
    while (modifiedWidget) {
      xPosition +=
        modifiedWidget.offsetLeft -
        modifiedWidget.scrollLeft +
        modifiedWidget.clientLeft;
      modifiedWidget = modifiedWidget.offsetParent;
    }
    return xPosition;
  };

  const onWidgetHide = event => {
    onWidgetHidden(event);
    targetRef.current.style.display = "none";
  };

  const target = targetRef.current;

  useEffect(() => {
    if (target) {
      const destroyWidget = widgetEngine.render(widget, target, {
        useConfigParser,
        isPreviewing,
        previewOptions,
        locale,
        defaultLocaleUrl,
        tracker,
        lazyLoadConfig,
        rank,
        appName,
        scrollContainer,
        callbacks,
        isRightPositioned:
          getWidgetPosition(target) >
          Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
          ) /
            2,
        externals: {
          ...externals,
          ...runtimeEnvironment,
        },
      });

      return destroyWidget;
    }
  }, [target]);

  return (
    <div
      id={targetId}
      data-target-id={targetId}
      ref={targetRef}
      onWidgetHidden={onWidgetHide}
      className={`text-indigo break-all ${styles[colspanClass]}`}
      style={{ minHeight: 200, minWidth: 200 }}
      {...restProps}
    >this is a widget</div>
  );
};
export default WidgetWrapper;
