import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {  //made the changes to schema based on the data that we want to display in the graph
      //prices are not going to be displayed on the graph but are required to calculate the ratio
      price_abc: 'float',
      price_def: 'float',
      ratio: 'float',
      upperBound: 'float',
      lowerBound: 'float',
      trigger_alert: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);

      //the attributes are changed to display the folowing data in the graph
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lowerBound", "upperBound", "trigger_alert"]');
      elem.setAttribute('aggregates', JSON.stringify({  //html attributes are strings so we need to convert the object to a string for aggregates
        //aggregates is important because it groups the datapoint based on the value of the timestamp, 
        //iff timestamp is the same then it will group the data based on the average of the other values
        price_abc: 'avg',
        price_def: 'avg',
        ratio: 'avg',
        upperBound: 'avg',
        lowerBound: 'avg',
        trigger_alert: 'avg',
        timestamp: 'distinct count',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(  //the update method expect an array of rows
      //since generate row method is only returning one object instead of an array of objects
        [DataManipulator.generateRow(this.props.data),] as unknown as TableData //the data is converted to a table data type
      );
    }
  }
}

export default Graph;
