import dataFetcher from "./data";
import getDataMapper from "./mapper";
import layoutFetcher from "./layout";

function getLayoutForWidget(layout) {
  return layoutFetcher.getLayout(layout);
}

function getMappedDataForWidget(dataSource, widgetMapper, stateMapper) {
  const mapStateToDataVariables = getDataMapper(stateMapper);
  const mapDataToComponentProps = getDataMapper(widgetMapper);
  return (dataState, { refresh = true }) => {
    const dataVariables = mapStateToDataVariables(dataState);
    const dataPromise = refresh
      ? dataFetcher.refresh(dataSource, dataVariables)
      : dataFetcher.fetch(dataSource, dataVariables);
    return dataPromise.then(fetchedData =>
      mapDataToComponentProps(fetchedData)
    );
  };
}

const fetchWidget = ({
  layout,
  fetchForDataState,
  initialDataState,
  rendererSet,
}) => {
  const layoutPromise = getLayoutForWidget(layout);
  layoutPromise
    .then(widgetLayout => {
      fetchForDataState(
        initialDataState,
        { refresh: false },
        { widgetLayout },
        rendererSet
      );
    })
    .catch(e => {
      rendererSet({ widgetComponentError: e });
      throw e;
    });
};

const getFetcherForWidgetData = ({
  originalWidget: { data: dataSource },
  parsedWidget: { mapper: widgetMapper, stateMapper },
}) => {
  const getDataPromise = getMappedDataForWidget(
    dataSource,
    widgetMapper,
    stateMapper
  );
  return (dataState, options, extraProps, rendererSet) => {
    const dataPromise = getDataPromise(dataState, options);
    dataPromise
      .then(widgetData => {
        rendererSet({ widgetData, widgetDataLoading: false, ...extraProps });
      })
      .catch(e => {
        rendererSet({ widgetDataError: e, ...extraProps });
        throw e;
      });
  };
}